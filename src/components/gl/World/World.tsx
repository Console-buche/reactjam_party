import { useSelector } from '@xstate/react';
import { Suspense, createContext, useRef, useState } from 'react';
import type { Group, Mesh } from 'three';
import type { ActorRefFrom } from 'xstate';
import type { personMachine } from '../../../machines/person.machine';
import { useGameMachineProvider } from '../../../hooks/use';
import { HouseModel } from '../House/HouseModel';
import { Person } from '../Person/Person';
import { Cam } from './Cam';
import { Bar } from '../Environment/HotSpot/Bar';
import { Toilet } from '../Environment/HotSpot/Toilet';

// initialize a react context with two values : isDragging and setIsDragging
// all state currently used to safe either ref of threejs object of actor ref
// nit : make a state machine for dragging
export const DraggingContext = createContext<{
  isDragging: boolean;
  draggingId: string | null;
  draggingActorRef: ActorRefFrom<typeof personMachine> | null;
  setIsDragging: (isDragging: boolean) => void;
  setDraggingId: (draggingId: string | null) => void;
  draggingRef: Group | null;
  setDraggingRef: (draggingRef: Group | null) => void;
  setDraggingActorRef: (
    draggingActorRef: ActorRefFrom<typeof personMachine> | null,
  ) => void;
}>({
  isDragging: false,
  setDraggingActorRef: () => {},
  setIsDragging: () => {},
  setDraggingId: () => {},
  draggingId: null,
  draggingRef: null,
  draggingActorRef: null,
  setDraggingRef: () => {},
});

DraggingContext.displayName = 'DraggingContext';

export const World = () => {
  const refFloor = useRef<Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<null | string>(null);
  const [draggingActorRef, setDraggingActorRef] = useState<null | ActorRefFrom<
    typeof personMachine
  >>(null);
  const [draggingRef, setDraggingRef] = useState<Group | null>(null);

  const gameService = useGameMachineProvider();
  const persons = useSelector(gameService, (state) => state.context.persons);

  return (
    <DraggingContext.Provider
      value={{
        isDragging,
        setIsDragging,
        setDraggingId,
        setDraggingActorRef,
        draggingId,
        draggingActorRef,
        draggingRef,
        setDraggingRef,
      }}
    >
      <Cam isDragging={isDragging} />

      <HouseModel
        ref={refFloor}
        onClick={() => {
          if (isDragging) {
            setIsDragging(false);
            setDraggingId(null);
          }
        }}
      />

      <Suspense fallback={null}>
        {persons.map((actor) => (
          <Person key={actor.id} refFloor={refFloor} actor={actor} />
        ))}
      </Suspense>

      <Bar />
      <Toilet />
    </DraggingContext.Provider>
  );
};
