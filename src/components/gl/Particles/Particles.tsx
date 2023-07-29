import { PointMaterial, Points, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Points as PointsType, Vector3 } from 'three';

export function moveParticles(
  points: number[],
  speeds: number[],
  initialPositions: number[],
  boundBot: number,
  boundTop: number,
  spreadFactor: number,
) {
  const numParticles = points.length / 3;
  const newPosition = new Float32Array(points.length);

  for (let i = 0; i < numParticles; i++) {
    const index = i * 3;
    const x = points[index];
    const y = points[index + 1];
    const z = points[index + 2];
    const speed = speeds[i];

    // Calculate evenly spread angles for x and z directions
    const angle = (i / numParticles) * Math.PI * 2;
    const radius = (1 - y / boundTop) * spreadFactor;
    const xOffset = Math.cos(angle) * speed * radius;
    const zOffset = Math.sin(angle) * speed * radius;

    newPosition[index] = x + xOffset;
    newPosition[index + 1] = y + speed;
    newPosition[index + 2] = z + zOffset;

    // Restart particle if it goes beyond the top bound
    if (newPosition[index + 1] > boundTop) {
      const initialX = initialPositions[index];
      const initialZ = initialPositions[index + 2];

      newPosition[index] = initialX;
      newPosition[index + 1] = boundBot;
      newPosition[index + 2] = initialZ;
    }
  }

  return newPosition;
}

type Particles = {
  count: number;
  speeds?: number[]; // Speed array for each particle
  animate?: boolean;
  position?: Vector3;
  spreadFactor?: number; // Parameter to control the end radius of the cone
};

export const Particles = ({
  animate,
  count,
  speeds,
  position,
  spreadFactor = 0.3,
}: Particles) => {
  const ref = useRef<PointsType>(null);
  const { viewport } = useThree();
  const boundBot = viewport?.height ? -viewport.height / 2 : -2;
  const boundTop = viewport?.height ? viewport.height / 2 : 2;

  // random position based on the position prop with a random offset of 2x units around it
  const positions = useMemo(() => {
    const positions = Float32Array.from(
      Array(count * 3)
        .fill(0)
        .map(() => (Math.random() - 0.5) * 0.25 + (position?.x || 0)),
    );

    return positions;
  }, [count, position]);

  // Initialize random speeds for each particle (if not provided)
  const particleSpeeds = useMemo(() => {
    if (!speeds) {
      return Array(count)
        .fill(0)
        .map(() => Math.random() * 0.1 + 0.01);
    }
    return speeds;
  }, [count, speeds]);

  // Store the initial positions and speeds of the particles
  const initialPositions = useMemo(() => positions.slice(), [positions]);
  const initialSpeeds = useMemo(() => particleSpeeds.slice(), [particleSpeeds]);

  const tex = useTexture('/assets/dudess.png');

  useFrame(() => {
    if (!ref.current || !animate) {
      return;
    }

    const newPositions = moveParticles(
      Array.from(ref.current.geometry.attributes.position.array),
      initialSpeeds,
      initialPositions,
      boundBot,
      boundTop,
      spreadFactor,
    );

    //@ts-ignore-line
    ref.current.geometry.attributes.position.copyArray(newPositions);
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions}>
      <PointMaterial
        size={1}
        transparent
        alphaTest={0.2}
        opacity={0.8}
        map={tex}
      />
    </Points>
  );
};
