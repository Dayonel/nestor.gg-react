import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SpotLightProps {
  scene: THREE.Scene;
  color: THREE.ColorRepresentation;
  intensity: number;
  distance?: number;
  decay?: number;
  penumbra?: number;
  angle?: number;
  position?: THREE.Vector3;
  castShadow?: boolean;
}

const SpotLight: React.FC<SpotLightProps> = ({
  scene,
  color,
  intensity,
  distance = 0,
  decay = 2,
  penumbra = 1,
  angle = Math.PI / 6,
  position = new THREE.Vector3(0, 0, 0),
  castShadow = true,
}) => {
  const lightRef = useRef<THREE.SpotLight | null>(null);

  useEffect(() => {
    // Create the SpotLight
    const spotLight = new THREE.SpotLight(
      color,
      intensity,
      distance,
      angle,
      penumbra,
      decay
    );
    spotLight.position.copy(position);

    if (castShadow) {
      spotLight.castShadow = true;
    }

    // Add to scene
    scene.add(spotLight);
    lightRef.current = spotLight;

    return () => {
      // Cleanup
      scene.remove(spotLight);
      spotLight.dispose();
    };
  }, [
    scene,
    color,
    intensity,
    distance,
    angle,
    penumbra,
    decay,
    position,
    castShadow,
  ]);

  return null; // This component interacts directly with the Three.js scene
};

export default SpotLight;
