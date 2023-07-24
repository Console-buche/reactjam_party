import { Sphere } from '@react-three/drei';
import type { MeshProps } from '@react-three/fiber';

type DropSpot = {
  size?: number;
  pos: MeshProps['position'];
};

export const DropSpot = ({ size = 1, pos }: DropSpot) => {
  return <Sphere args={[size, 32, 32]} position={pos} material-color="blue" />;
};
