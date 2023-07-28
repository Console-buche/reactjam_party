import type { Raycaster, Scene } from 'three';

type OnClickProps = {
  raycaster: Raycaster;
  scene: Scene;
};

export const useOnClick = ({ raycaster, scene }: OnClickProps) => {};
