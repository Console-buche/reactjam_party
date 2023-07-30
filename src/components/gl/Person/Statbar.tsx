import { useTexture } from '@react-three/drei';
import { useFrame, type MeshProps } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { BufferGeometry, MathUtils, Mesh } from 'three';
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
    uniform float time;
    uniform float moreIsGood;

    varying vec2 vUv;

    void main() {

      vec4 iconTexture = texture2D(iconTexture, vUv);

      if (vUv.y > percent) {
        iconTexture *= 0.8;
      } else {
        iconTexture *= 1.4;
      }

      float blink = sin(time * 10.0) * 0.5 + 0.5;
      float clampedBlink = clamp(blink, 0.15, 1.0);
      

      if (moreIsGood == 1. ? percent < 0.3 : percent > 0.66) {
          iconTexture *= clampedBlink;
          iconTexture *= vec4(1.5, 0.5, 0.5, 1.); // add red tint when danger
        }
      
      


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
      time: { value: 0 },
      moreIsGood: { value: statName === 'urine' ? 0.0 : 1.0 },
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

    ref.current.material.uniforms.time.value += 0.015;

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
