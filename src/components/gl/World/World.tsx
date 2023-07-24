import { useSelector } from '@xstate/react';
import { Suspense, createContext, useRef, useState } from 'react';
import { Group, Mesh } from 'three';
import { ActorRefFrom } from 'xstate';
import { useGameMachineProvider } from '../../../hooks/use';
import { personMachine } from '../../../machines/person.machine';
import { Hotspot } from '../Environment/HotSpot/Hotspot';
import { HouseModel } from '../House/HouseModel';
import { Person } from '../Person/Person';
import { Cam } from './Cam';
import { Bar } from '../Environment/HotSpot/Bar';
import { Toilet } from '../Environment/HotSpot/Toilet';

// initialize a react context with two values : isDragging and setIsDragging
// TODO/nice to have : dragging machine. But this works nice as is.
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
      <ambientLight />
      <directionalLight />
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

      {/* <Model
        ref={refFloor}
        onClick={() => {
          if (isDragging) {
            setIsDragging(false);
            setDraggingId(null);
          }
        }}
      /> */}

      <Suspense fallback={null}>
        {persons.map((actor) => (
          <Person key={actor.id} refFloor={refFloor} actor={actor} />
        ))}
      </Suspense>

      <Bar />
      <Toilet />
      {/* <Hotspot type="drink" dropSpotQuality={7} position={[13, 0, -10]} />
      <Hotspot type="battery" dropSpotQuality={3} position={[3, 0, 10]} /> */}
    </DraggingContext.Provider>
  );
};
