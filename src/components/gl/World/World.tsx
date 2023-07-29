import { Box } from '@react-three/drei';
import { useSelector } from '@xstate/react';
import { Suspense, useRef } from 'react';
import { type Mesh } from 'three';
import { useGameMachineProvider } from '../../../hooks/use';
import { useStoreHotspot } from '../../../stores/storeHotspots';
import { AppartmentV6 } from '../House/Appartment_v6';
import { Person } from '../Person/Person';
import { PostProcess } from '../postProcess/PostProcess';
import { Cam } from './Cam';

export const World = () => {
  const refFloor = useRef<Mesh>(null);
  const gameService = useGameMachineProvider();
  const persons = useSelector(gameService, (state) => state.context.persons);

  const dropZones = useStoreHotspot((state) => state.hotspots);

  const zones = Object.entries(dropZones).flatMap(([_, data]) =>
    data.dropzones.map((zone) => zone.position),
  );

  return (
    <group>
      <Cam />

      {/* Debug dropzones */}
      {zones.map((pos, i) => (
        <Box position={pos} key={i} />
      ))}

      <AppartmentV6 ref={refFloor} position-y={-0.5} />
      {/* <DropZones /> */}
      <Suspense fallback={null}>
        {persons.map((actor) => (
          <Person key={actor.id} refFloor={refFloor} actor={actor} />
        ))}
      </Suspense>

      <PostProcess />
    </group>
  );
};
