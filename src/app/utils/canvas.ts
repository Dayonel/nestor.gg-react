import * as THREE from "three";
import { PerspectiveCamera } from "three";

export const resizeCanvas = (
  element: HTMLCanvasElement | undefined,
  renderer: THREE.WebGLRenderer | null,
  camera: PerspectiveCamera | null
): void => {
  if (!element) return;
  if (!renderer) return;
  if (!camera) return;

  camera.aspect = element.clientWidth / element.clientHeight;
  camera.updateProjectionMatrix();
  const width = element.clientWidth | 0;
  const height = element.clientHeight | 0;
  renderer.setSize(width, height, false);
};
