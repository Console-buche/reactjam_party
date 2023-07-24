import type { MeshProps } from '@react-three/fiber';

export const DummyBox = (props: MeshProps) => {
  return (
    <mesh {...props}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};
