import { useEffect, useRef } from "react";
import styles from "./Three.module.css";
import WebGL from "three/examples/jsm/capabilities/WebGL.js";
import * as THREE from "three";
import Scene1 from "../Scenes/Scene1";
import Stats from "three/examples/jsm/libs/stats.module";

interface ThreeProps {
  scene: number;
  preRendered: boolean;
  scenes: THREE.Scene[];
  scrollY: number;
  models: any[];
  hdris: any[];
  textures: any[];
}

const weblAvailable = WebGL.isWebGLAvailable();

export default function Three({
  scene,
  preRendered,
  scenes,
  scrollY,
  models,
  hdris,
  textures,
}: ThreeProps) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const introRef = useRef(false);

  let stats: any;

  // Ensure init() is called only once
  const initCalledRef = useRef(false);

  useEffect(() => {
    if (!initCalledRef.current) {
      initCalledRef.current = true;
      init();
    }
  }, []);

  useEffect(() => {
    if (!preRendered || !rendererRef.current) return;

    // Initialize stats
    stats = new Stats();
    document.body.appendChild(stats.dom);

    // Start rendering loop
    loop();
    introRef.current = true;
  }, [preRendered, rendererRef.current]);

  const init = () => {
    if (!weblAvailable) return;

    // Dispose any existing renderer to prevent WebGL context leakage
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // Enable shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.autoClear = false;

    rendererRef.current = renderer;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      30000
    );

    cameraRef.current = camera;

    // Append renderer to DOM
    const canvas = document.body.appendChild(renderer.domElement);
    renderer.domElement.id = "threejs";
    canvasRef.current = canvas;
  };

  const loop = () => {
    if (!rendererRef.current) return;

    requestAnimationFrame(loop);

    scenes.forEach((f) => {
      if (f.userData.scene === scene) {
        rendererRef.current!.render(f, f.userData.camera);
      }
    });

    // stats.update();
  };

  if (!weblAvailable) {
    return (
      <p className={styles.message}>
        {WebGL.getWebGLErrorMessage().textContent}
      </p>
    );
  }

  return (
    <>
      <Scene1
        models={models}
        renderer={rendererRef.current}
        camera={cameraRef.current}
        scrollY={scrollY}
        enabled={scene === 1}
        intro={introRef.current}
        onMount={(e) => scenes.push(e)}
      />
    </>
  );
}
