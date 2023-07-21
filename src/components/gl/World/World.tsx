import { createContext, useMemo, useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { Person } from "../Person/Person";
import { DummyBox } from "./DummyBox";
import { Floor } from "./Floor";
import { OrbitControls, Text } from "@react-three/drei";
import { useSelector } from "@xstate/react";
import { useGameMachineProvider } from "../../../hooks/use";

// initialize a react context with two values : isDragging and setIsDragging
// TODO/nice to have : dragging machine. But this works nice as is.

export const DraggingContext = createContext<{
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}>({
  isDragging: false,
  setIsDragging: () => {},
});

DraggingContext.displayName = "DraggingContext";

export const World = () => {
  const refFloor = useRef<Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);

  const service = useGameMachineProvider();
  const PISS_COUNT = useSelector(service, (state) => state.context.PISS_COUNT);

  const dummyBoxes = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        i,
        scaleY: Math.random() * 3 + 1,
        pos: new Vector3(
          Math.random() * 50 - 25,
          -0.5,
          Math.random() * 50 - 25
        ),
      })),
    []
  );

  return (
    <DraggingContext.Provider value={{ isDragging, setIsDragging }}>
      {!isDragging && <OrbitControls />}

      <Floor ref={refFloor} onPointerUp={() => setIsDragging(false)} />
      <Person refFloor={refFloor} />

      <Text color={"red"} position-y={3} scale={10}>
        {PISS_COUNT}
      </Text>
      {dummyBoxes.map(({ i, scaleY, pos }) => (
        <DummyBox key={i} scale-y={scaleY} position={pos} />
      ))}
    </DraggingContext.Provider>
  );
};
