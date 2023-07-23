import { MeshProps } from '@react-three/fiber';
import { forwardRef } from 'react';
import { Mesh } from 'three';

// USE for testing only
export const Floor = forwardRef<Mesh, MeshProps>((props, ref) => (
  // todo : use ref in machine instead
  <mesh ref={ref} position-y={-1} rotation-x={Math.PI * -0.5} {...props}>
    <planeBufferGeometry args={[100, 100]} />
    <meshBasicMaterial />
  </mesh>
));
