import { useSelector } from '@xstate/react';
import { Suspense, createContext, useRef, useState } from 'react';
import { Group, Mesh } from 'three';
import { Model } from '../../../../public/assets/Reactjam_party';
import { useGameMachineProvider } from '../../../hooks/use';
import { Hotspot } from '../Environment/HotSpot/Hotspot';
import { Person } from '../Person/Person';
import { Cam } from './Cam';

// initialize a react context with two values : isDragging and setIsDragging
// TODO/nice to have : dragging machine. But this works nice as is.
export const DraggingContext = createContext<{
  isDragging: boolean;
  draggingId: string | null;
  setIsDragging: (isDragging: boolean) => void;
  setDraggingId: (draggingId: string | null) => void;
  draggingRef: Group | null;
  setDraggingRef: (draggingRef: Group | null) => void;
}>({
  isDragging: false,
  setIsDragging: () => {},
  setDraggingId: () => {},
  draggingId: null,
  draggingRef: null,
  setDraggingRef: () => {},
});

DraggingContext.displayName = 'DraggingContext';

export const World = () => {
  const refFloor = useRef<Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<null | string>(null);
  const [draggingRef, setDraggingRef] = useState<Group | null>(null);

  const gameService = useGameMachineProvider();
  const persons = useSelector(gameService, (state) => state.context.persons);

  return (
    <DraggingContext.Provider
      value={{
        isDragging,
        setIsDragging,
        setDraggingId,
        draggingId,
        draggingRef,
        setDraggingRef,
      }}
    >
      <ambientLight />
      <directionalLight />
      <Cam isDragging={isDragging} />

      <Model
        ref={refFloor}
        onClick={() => {
          if (isDragging) {
            setIsDragging(false);
            setDraggingId(null);
          }
        }}
      />

      <Suspense fallback={null}>
        {persons.map(({ id }) => (
          <Person key={id} refFloor={refFloor} />
        ))}
      </Suspense>

      <Hotspot type="battery" dropSpotQuality={5} position={[-6, 0, -7]} />
      <Hotspot type="drink" dropSpotQuality={7} position={[13, 0, -10]} />
      <Hotspot type="battery" dropSpotQuality={3} position={[3, 0, 10]} />
    </DraggingContext.Provider>
  );
};
