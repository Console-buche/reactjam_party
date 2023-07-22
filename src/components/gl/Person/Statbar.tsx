import { useFrame } from "@react-three/fiber";
import { useSelector } from "@xstate/react";
import { useMemo, useRef } from "react";
import { BufferGeometry, Mesh } from "three";
import { usePersonMachineProvider } from "../../../hooks/use";

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

        if (vUv.x > percent && vUv.y > 0.05 && vUv.y < 0.95 && vUv.x < 0.99) {

            discard;

        }

        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

export const Statbar = () => {
  const service = usePersonMachineProvider();
  const ref = useRef<Mesh<BufferGeometry, THREE.ShaderMaterial>>(null);

  const uniforms = useMemo(
    () => ({
      percent: { value: 0.01 },
    }),
    []
  );

  useFrame(({ camera }) => {
    if (!ref.current) {
      return;
    }

    ref.current.lookAt(camera.position);

    // update stat

    // TODO : add bounds + decrease on event only
    ref.current.material.uniforms.percent.value =
      service.getSnapshot().context.thirst / 100;

    ref.current.material.uniformsNeedUpdate = true;
  });

  return (
    <mesh ref={ref} position-y={4}>
      <planeBufferGeometry args={[1.5, 0.2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};
