import { useSelector } from '@xstate/react';
import { Suspense, useRef } from 'react';
import type { Mesh } from 'three';
import { useGameMachineProvider } from '../../../hooks/use';
import { Person } from '../Person/Person';
import { PostProcess } from '../postProcess/PostProcess';
import { Cam } from './Cam';
import { AppartmentV4 } from '../House/Appartment_v4';

export const World = () => {
  const refFloor = useRef<Mesh>(null);
  const gameService = useGameMachineProvider();
  const persons = useSelector(gameService, (state) => state.context.persons);

  return (
    <>
      <Cam />

      <AppartmentV4 ref={refFloor} position-y={-0.5} />

      <Suspense fallback={null}>
        {persons.map((actor) => (
          <Person key={actor.id} refFloor={refFloor} actor={actor} />
        ))}
      </Suspense>

      <PostProcess />
    </>
  );
};
