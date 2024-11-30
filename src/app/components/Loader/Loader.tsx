"use client";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import Loading from "../Loading/Loading";
import Three from "../Three/Three";

const gltfLoader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderConfig({ type: "js" });
draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
gltfLoader.setDRACOLoader(draco);

const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

const models = [
  "models/amsterdam1.glb",
  "models/amsterdam2.glb",
  "models/amsterdam3.glb",
  "models/amsterdam4.glb",
  "models/github.glb",
];

const time: number = 1;
const timeMs = time * 1000;
const hdris: string[] = ["hdris/empty_warehouse_01_1k.hdr"];
const textures: string[] = ["textures/lineage2.png"];
const updates = 2;
const breakpoint = ((timeMs * 1) / updates) * 0.9;
const intervalDuration = timeMs / updates;
const total = models.length + hdris.length + textures.length + updates;

interface LoaderProps {
  onLoad: () => void;
  scrollY: number;
  scene: number;
}

export default function Loader({ onLoad, scrollY, scene }: LoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [progress, setProgress] = useState(0);

  const modelsLoadedRef = useRef<THREE.Scene[]>([]);
  const hdrisLoadedRef = useRef<THREE.Texture[]>([]);
  const texturesLoadedRef = useRef<THREE.Texture[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const scenesRef = useRef<THREE.Scene[]>([]);
  const [preRendered, setPreRendered] = useState(false);
  const lastCountRef = useRef(0);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await Promise.all([loadModels(), loadHdris(), loadTextures()]);
        await preRender();
        setLoading(false);
        onLoad();
      } catch (err) {
        setError(err);
      }
    };

    loadAssets();
  }, []);

  const loadHdris = async (): Promise<void> => {
    for (const material of hdris) {
      const texture = await rgbeLoader.loadAsync(material);
      hdrisLoadedRef.current.push(texture);
      setProgress((prev) => prev + 1);
    }
  };

  const loadModels = async (): Promise<void> => {
    for (const model of models) {
      const loadedModel = await gltfLoader.loadAsync(model);
      modelsLoadedRef.current.push(loadedModel.scene);
      setProgress((prev) => prev + 1);
    }
  };

  const loadTextures = async (): Promise<void> => {
    for (const texturePath of textures) {
      const texture = await textureLoader.loadAsync(texturePath);
      texturesLoadedRef.current.push(texture);
      setProgress((prev) => prev + 1);
    }
  };

  const preRender = (): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const renderLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;

        if (elapsed >= timeMs) {
          setProgress((prev) => prev + 1);
          setPreRendered(true);
          resolve();
          return;
        }

        if (rendererRef.current) {
          scenesRef.current.forEach((scene) => {
            rendererRef.current!.render(scene, scene.userData.camera);
            rendererRef.current!.clear();
          });
        }

        const count = progress - total + updates;
        if (
          elapsed >= breakpoint &&
          count < updates &&
          elapsed - breakpoint >= count * intervalDuration &&
          count !== lastCountRef.current
        ) {
          setProgress((prev) => prev + 1);
          lastCountRef.current = count;
        }

        requestAnimationFrame(renderLoop);
      };

      requestAnimationFrame(renderLoop);
    });
  };

  if (loading) {
    return <Loading progress={progress} total={total} />;
  }

  if (error) {
    return <p className="fail">Failed to load items: {String(error)}</p>;
  }

  return (
    <Three
      scenes={scenesRef.current}
      scrollY={scrollY}
      models={modelsLoadedRef.current}
      hdris={hdrisLoadedRef.current}
      textures={texturesLoadedRef.current}
      scene={scene}
      preRendered={preRendered}
    />
  );
}
