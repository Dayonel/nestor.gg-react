import { forwardRef, useEffect } from "react";
import * as THREE from "three";

interface PointLightProps {
  scene: THREE.Scene;
  color: THREE.ColorRepresentation;
  intensity: number;
  distance?: number;
  decay?: number;
  position?: THREE.Vector3Like;
}

const PointLight = forwardRef(function PointLight(
  { scene, color, intensity, distance, decay, position }: PointLightProps,
  ref
) {
  useEffect(() => {
    const pointLight = new THREE.PointLight(color, intensity, distance, decay);
    if (position) {
      pointLight.position.copy(position);
    }

    scene.add(pointLight);

    (ref as React.MutableRefObject<THREE.PointLight>).current = pointLight;

    return () => {
      scene.remove(pointLight);
    };
  }, []);

  return null;
});

export default PointLight;
