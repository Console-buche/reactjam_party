import { Canvas, useThree } from '@react-three/fiber';
import { World } from '../World/World';
import { Stars } from '@react-three/drei';

export const Scene = () => {
  return (
    <Canvas
      camera={{ fov: 65 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Stars />
      <color attach="background" args={['purple']} />
      <ambientLight intensity={1.5} />

      <World />
    </Canvas>
  );
};
