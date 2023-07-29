import { Text, useTexture } from '@react-three/drei';
import { type MeshProps, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { BufferGeometry, MathUtils, Mesh } from 'three';
import { DEG2RAD } from 'three/src/math/MathUtils';
import type { METERS_CONFIG } from '../../../machines/person.machine';

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float percent;
    uniform sampler2D iconTexture;
    varying vec2 vUv;


    void main() {

      vec4 iconTexture = texture2D(iconTexture, vUv);

      if (vUv.y > percent) {
        iconTexture *= 0.8;
      } else {
        iconTexture *= 1.4;
      }

      

        // if (vUv.x > percent && vUv.y > 0.05 && vUv.y < 0.95 && vUv.x < 0.99 && vUv.x > 0.01) {

        //     discard;

        // }

        // float dangerFactor = percent / 

        gl_FragColor = iconTexture;
    }
`;

type Statbar = {
  value: number;
  statName: keyof typeof METERS_CONFIG;
} & MeshProps;

export const Statbar = ({ value, statName, ...meshProps }: Statbar) => {
  const ref = useRef<Mesh<BufferGeometry, THREE.ShaderMaterial>>(null);

  const tex = useTexture(`assets/icons/${statName}.png`);

  const uniforms = useMemo(
    () => ({
      percent: { value: 0.01 },
      iconTexture: { value: tex },
    }),
    [tex],
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
      <planeBufferGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
      {/* <Text fontSize={0.35} position-x={1.2} color="black">
        {statName}
      </Text> */}
    </mesh>
  );
};
