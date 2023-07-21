import { Canvas } from "@react-three/fiber";
import { World } from "../World";
import { Stats } from "@react-three/drei";

export const Scene = () => {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <World />
      <Stats />
    </Canvas>
  );
};
