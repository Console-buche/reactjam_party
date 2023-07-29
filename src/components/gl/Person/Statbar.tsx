import { Text } from '@react-three/drei';
import { type MeshProps, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { BufferGeometry, MathUtils, Mesh } from 'three';
import { DEG2RAD } from 'three/src/math/MathUtils';

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float percent;
    varying vec2 vUv;
    void main() {

        if (vUv.x > percent && vUv.y > 0.05 && vUv.y < 0.95 && vUv.x < 0.99 && vUv.x > 0.01) {

            discard;

        }

        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
`;

type Statbar = {
  value: number;
  label: string;
} & MeshProps;

export const Statbar = ({ value, label, ...meshProps }: Statbar) => {
  const ref = useRef<Mesh<BufferGeometry, THREE.ShaderMaterial>>(null);

  const uniforms = useMemo(
    () => ({
      percent: { value: 0.01 },
    }),
    [],
  );

  useFrame(({ camera }) => {
    if (!ref.current) {
      return;
    }

    ref.current.lookAt(camera.position);

    ref.current.material.uniforms.percent.value = MathUtils.lerp(
      ref.current.material.uniforms.percent.value,
      value / 100,
      0.1,
    );

    ref.current.material.uniformsNeedUpdate = true;
  });

  return (
    <mesh ref={ref} {...meshProps}>
      <planeBufferGeometry args={[1.5, 0.2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
      <Text fontSize={0.35} position-x={1.2} color="black">
        {label}
      </Text>
    </mesh>
  );
};
