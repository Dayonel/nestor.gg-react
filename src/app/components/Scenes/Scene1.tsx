import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { MaterialDTO } from "@/app/core/dto/MaterialDTO";
import { resizeCanvas } from "@/app/utils/canvas";
import PointLight from "@/app/lib/three/PointLight";

interface Scene1Props {
  models: any[];
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  scrollY: number;
  enabled: boolean;
  intro: boolean;
  onMount: (scene: THREE.Scene) => void;
}

const Scene1: React.FC<Scene1Props> = ({
  models,
  renderer,
  camera,
  scrollY,
  enabled,
  intro,
  onMount,
}) => {
  const sceneRef = useRef(new THREE.Scene());
  const groupRef = useRef(new THREE.Group());
  const introTweenRef = useRef<any>(null);
  const scrollTweenRef = useRef<any>(null);
  const [introFinished, setIntroFinished] = useState(false);

  const cameraZ = 25;
  const tweenToZ = cameraZ - 10;
  const fovLandscape = 70;
  const fovPortrait = 105;

  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);
  const light4Ref = useRef<THREE.PointLight>(null);

  // Materials
  const materials = [
    new MaterialDTO(
      new THREE.MeshPhysicalMaterial({
        roughness: 0.7,
        thickness: 1,
        color: 0xcecece,
      }),
      "Windows"
    ),
    new MaterialDTO(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.6,
        side: THREE.DoubleSide,
      })
    ),
  ];

  useEffect(() => {
    if (!camera) return;
    // Scene setup
    const scene = sceneRef.current;
    const group = groupRef.current;
    scene.add(group);
    scene.userData = { camera, scene: 1 };

    camera.position.set(0, 7, cameraZ);

    gsap.registerPlugin(ScrollTrigger);
    onMount(scene);

    return () => {
      // Cleanup ScrollTrigger and scene
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      scene.clear();
    };
  }, [camera, onMount]);

  useEffect(() => {
    if (enabled) {
      resizeCanvas(renderer?.domElement, renderer, camera);
      updateToneMapping();
      startLoop();
    }
  }, [enabled]);

  useEffect(() => {
    if (intro) {
      playIntroAnimation();
    }
  }, [intro]);

  const playIntroAnimation = () => {
    if (!camera) return;

    introTweenRef.current = new TWEEN.Tween(camera.position)
      .to({ z: tweenToZ }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => setIntroFinished(true))
      .start();
  };

  const updateToneMapping = () => {
    if (renderer) {
      renderer.toneMappingExposure = 2;
    }
  };

  const startLoop = () => {
    const loop = () => {
      const time = Date.now() * 0.0005;

      if (!introFinished) {
        TWEEN.update();
      }

      // Update light positions
      const lights = [light1Ref, light2Ref, light3Ref, light4Ref];
      const z = 40;

      lights.forEach((light, index) => {
        const phase = time + index * 0.7;
        if (light.current) {
          light.current.position.x = Math.sin(phase) * 30;
          light.current.position.y = Math.cos(phase) * 40;
          light.current.position.z = Math.sin(phase) * z;
        }
      });

      // Rotate group based on scrollY
      groupRef.current.rotation.y =
        THREE.MathUtils.degToRad(scrollY / window.innerHeight) * 180;

      // Continue loop
      requestAnimationFrame(loop);
    };

    loop();
  };

  const setupScrollAnimation = () => {
    if (!camera) return;

    scrollTweenRef.current = gsap.timeline({
      scrollTrigger: {
        scroller: "#scrolling",
        start: "top top",
        end: "+=" + window.innerHeight,
        scrub: true,
      },
    });

    scrollTweenRef.current.to(camera.position, {
      z: cameraZ,
    });
  };

  const resizeCanvasHandler = () => {
    if (!enabled || !camera || !renderer) return;

    camera.fov =
      window.innerHeight > window.innerWidth ? fovPortrait : fovLandscape;
    resizeCanvas(renderer.domElement, renderer, camera);
  };

  useEffect(() => {
    if (enabled) {
      window.addEventListener("resize", resizeCanvasHandler);
      setupScrollAnimation();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvasHandler);
    };
  }, [enabled]);

  return (
    <>
      {/* Lights */}
      <PointLight
        ref={light1Ref}
        scene={sceneRef.current}
        color={0xff0040}
        intensity={50}
      />
      <PointLight
        ref={light2Ref}
        scene={sceneRef.current}
        color={0x0040ff}
        intensity={50}
      />
      <PointLight
        ref={light3Ref}
        scene={sceneRef.current}
        color={0x80ff80}
        intensity={50}
      />
      <PointLight
        ref={light4Ref}
        scene={sceneRef.current}
        color={0xffaa00}
        intensity={50}
      />
    </>
  );
};

export default Scene1;
