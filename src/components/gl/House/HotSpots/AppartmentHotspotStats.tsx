import { Text } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import type { ActorRefFrom, InterpreterFrom } from 'xstate';
import type { hotspotMachine } from '../../../../machines/hotspot.machine';
import type { MeshProps } from '@react-three/fiber';
import type { barMachine } from '../../../../machines/bar.machine';
import type { toiletMachine } from '../../../../machines/toilet.machine';

type AppartmentHotspotStats = {
  service: ActorRefFrom<typeof barMachine> | ActorRefFrom<typeof toiletMachine>;
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
