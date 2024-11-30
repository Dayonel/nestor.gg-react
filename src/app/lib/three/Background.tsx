import { useEffect, useRef } from "react";
import * as THREE from "three";

interface PlaneProps {
  scene: THREE.Scene;
  width?: number;
  height?: number;
  color: THREE.ColorRepresentation;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: number;
  receiveShadow?: boolean;
  material?: THREE.Material;
}

const Plane: React.FC<PlaneProps> = ({
  scene,
  width = 200,
  height = 200,
  color,
  position = new THREE.Vector3(0, 0, 0),
  rotation = new THREE.Euler(0, 0, 0),
  scale = 1,
  receiveShadow = true,
  material = new THREE.MeshStandardMaterial({ color }),
}) => {
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    // Create geometry and mesh
    const geometry = new THREE.PlaneGeometry(width, height);
    const mesh = new THREE.Mesh(geometry, material);

    // Set properties
    mesh.position.copy(position);
    mesh.rotation.copy(rotation);
    mesh.scale.multiplyScalar(scale);
    if (receiveShadow) {
      mesh.receiveShadow = true;
    }

    // Add to scene
    scene.add(mesh);
    meshRef.current = mesh;

    return () => {
      // Cleanup
      scene.remove(mesh);
      geometry.dispose();
      if (material instanceof THREE.Material) {
        material.dispose();
      }
    };
  }, [
    scene,
    width,
    height,
    color,
    position,
    rotation,
    scale,
    receiveShadow,
    material,
  ]);

  return null; // This component is purely for rendering in the Three.js scene
};

export default Plane;
