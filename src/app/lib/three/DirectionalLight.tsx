import { useEffect, useRef } from "react";
import * as THREE from "three";

interface DirectionalLightProps {
  scene: THREE.Scene;
  color: THREE.ColorRepresentation;
  intensity: number;
  position?: THREE.Vector3;
  scale?: number;
}

const DirectionalLight: React.FC<DirectionalLightProps> = ({
  scene,
  color,
  intensity,
  position = new THREE.Vector3(0, 0, 0),
  scale = 1,
}) => {
  const lightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    // Create the DirectionalLight
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.copy(position);
    directionalLight.position.multiplyScalar(scale);

    directionalLight.castShadow = true;

    // Configure shadow settings
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    const d = 50;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    directionalLight.shadow.camera.far = 3500;
    directionalLight.shadow.bias = -0.0001;

    // Add to the scene
    scene.add(directionalLight);
    lightRef.current = directionalLight;

    return () => {
      // Cleanup
      scene.remove(directionalLight);
      directionalLight.dispose();
    };
  }, [scene, color, intensity, position, scale]);

  return null; // This component doesn't render any DOM elements
};

export default DirectionalLight;
