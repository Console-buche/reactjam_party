import { Canvas } from "@react-three/fiber";
import { World } from "../World";

export const Scene = () => {
  return (
    <Canvas gl={{ alpha: true }} style={{ width: "100vw", height: "100vh" }}>
      <World />
      {/* <Stats /> */}
    </Canvas>
  );
};
