import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { World } from "../World";

export const Scene = () => {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <World />
      <OrbitControls />
      <Stats />
    </Canvas>
  );
};
