import { Canvas } from '@react-three/fiber';
import { World } from '../World';

export const Scene = () => {
  return (
    <Canvas
      camera={{ fov: 45 }}
      gl={{ alpha: true }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <ambientLight />
      <World />
      {/* <Stats /> */}
    </Canvas>
  );
};
