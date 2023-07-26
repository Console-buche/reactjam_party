import { useSelector } from '@xstate/react';
import { Suspense, useRef } from 'react';
import type { Mesh } from 'three';
import { useGameMachineProvider } from '../../../hooks/use';
import { Bar } from '../Environment/HotSpot/Bar';
import { Toilet } from '../Environment/HotSpot/Toilet';
import { AppartmentModel } from '../House/Appartment_v1';
import { Person } from '../Person/Person';
import { Cam } from './Cam';
import { useFrame } from '@react-three/fiber';
import { PostProcess } from '../postProcess/PostProcess';

function Debug() {
  const ref = useRef<Mesh>(null);

  useFrame(({ camera }) => {
    if (!ref.current) {
      return;
    }

    ref.current.position.copy(camera.position);
    ref.current.position.z = 20;
  });

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

export const World = () => {
  const refFloor = useRef<Mesh>(null);
  const gameService = useGameMachineProvider();
  const persons = useSelector(gameService, (state) => state.context.persons);

  return (
    <>
      <Cam />

      {/* <HouseModel ref={refFloor} /> */}

      <AppartmentModel ref={refFloor} />

      <Suspense fallback={null}>
        {persons.map((actor) => (
          <Person key={actor.id} refFloor={refFloor} actor={actor} />
        ))}
      </Suspense>

      <PostProcess />
      {/* <Debug /> */}
    </>
  );
};
