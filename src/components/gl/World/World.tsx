import { useSelector } from '@xstate/react';
import { Suspense, useRef } from 'react';
import type { Mesh } from 'three';
import { useGameMachineProvider } from '../../../hooks/use';
import { Bar } from '../Environment/HotSpot/Bar';
import { Toilet } from '../Environment/HotSpot/Toilet';
import { HouseModel } from '../House/HouseModel';
import { Person } from '../Person/Person';
import { Cam } from './Cam';

export const World = () => {
  const refFloor = useRef<Mesh>(null);
  const gameService = useGameMachineProvider();
  const persons = useSelector(gameService, (state) => state.context.persons);

  return (
    <>
      <Cam />

      <HouseModel ref={refFloor} />

      <Suspense fallback={null}>
        {persons.map((actor) => (
          <Person key={actor.id} refFloor={refFloor} actor={actor} />
        ))}
      </Suspense>

      <Bar />
      <Toilet />
    </>
  );
};
