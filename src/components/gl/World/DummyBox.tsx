import { MeshProps } from "@react-three/fiber";

export const DummyBox = (props: MeshProps) => {
  return (
    <mesh {...props}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color="hotpink" />
    </mesh>
  );
};
