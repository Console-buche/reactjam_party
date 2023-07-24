import { Canvas } from '@react-three/fiber';
import { World } from '../World';

export const Scene = () => {
  return (
    <Canvas
      camera={{ fov: 65 }}
      gl={{ alpha: true }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <color attach={'background'} args={['#ccc']} />
      <ambientLight />
      <World />
    </Canvas>
  );
};
