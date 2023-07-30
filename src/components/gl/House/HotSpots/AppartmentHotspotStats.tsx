import { a, useSpring } from '@react-spring/three';
import { Text } from '@react-three/drei';
import { type GroupProps, type MeshProps } from '@react-three/fiber';

type AppartmentHotspotStats = {
  textPosition?: MeshProps['position'];
  personsCount: number;
  maxPersonsCount: number;
} & GroupProps;

export const AppartmentHotspotStats = ({
  maxPersonsCount,
  personsCount,
  textPosition,
  ...props
}: AppartmentHotspotStats) => {
  const fillRatio = personsCount / maxPersonsCount;
  const scaleFromFillRatio = fillRatio * 0.5 + 1;

  const { scale, emissiveIntensiry } = useSpring({
    emissiveIntensiry: scaleFromFillRatio * 4,
    scale: [
      scaleFromFillRatio,
      scaleFromFillRatio,
      scaleFromFillRatio,
    ] as const,
  });

  return (
    <a.group scale={scale} {...props}>
      <Text fontSize={0.7} renderOrder={1} position={textPosition}>
        {personsCount}/{maxPersonsCount}
        {/* @ts-ignore */}
        <a.meshStandardMaterial
          color="white"
          emissive={0xffffff}
          emissiveIntensity={emissiveIntensiry}
          toneMapped={false}
          depthTest={false} // do we want to keep this style ? Better UX, but style to discuss as always visible
          depthWrite={false}
        />
      </Text>
      {/* <group position-y={5}>
        <Particles count={3} animate />
      </group> */}
    </a.group>
  );
};
