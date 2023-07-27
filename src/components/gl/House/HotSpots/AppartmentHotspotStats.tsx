import { Text } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import type { InterpreterFrom } from 'xstate';
import type { hotspotMachine } from '../../../../machines/hotspot.machine';
import type { MeshProps } from '@react-three/fiber';

type AppartmentHotspotStats = {
  service: InterpreterFrom<typeof hotspotMachine>;
  textPosition: MeshProps['position'];
};

export const AppartmentHotspotStats = ({
  service,
  textPosition,
}: AppartmentHotspotStats) => {
  const { persons, maxPersons } = useSelector(service, (s) => s.context);

  return (
    <Text position={textPosition} fontSize={0.7}>
      {persons.length}/{maxPersons}
      <meshStandardMaterial
        color="white"
        emissive={0xffffff}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </Text>
  );
};
