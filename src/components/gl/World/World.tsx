import { useSelector } from '@xstate/react';
import { Suspense, useRef } from 'react';
import { type Mesh } from 'three';
import { useGameMachineProvider } from '../../../hooks/use';
import { AppartmentV8 } from '../House/Appartment_v8';
import { Person } from '../Person/Person';
import { PostProcess } from '../postProcess/PostProcess';
import { Cam } from './Cam';

export const World = () => {
  const refFloor = useRef<Mesh>(null);
  const gameService = useGameMachineProvider();
  const persons = useSelector(gameService, (state) => state.context.persons);

  return (
    <group>
      <Cam />

      <Suspense fallback={null}>
        <AppartmentV8 position-y={-0.5} />
        {persons.map((actor) => (
          <Person key={actor.id} refFloor={refFloor} actor={actor} />
        ))}
      </Suspense>

      <PostProcess />
    </group>
  );
};
