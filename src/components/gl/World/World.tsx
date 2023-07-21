import { OrbitControls, Text } from "@react-three/drei";
import { useSelector } from "@xstate/react";
import { createContext, useMemo, useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { useGameMachineProvider } from "../../../hooks/use";
import { Person } from "../Person/Person";
import { DummyBox } from "./DummyBox";
import { Floor } from "./Floor";
import { Hotspot } from "../Environment/HotSpot/Hotspot";

// initialize a react context with two values : isDragging and setIsDragging
// TODO/nice to have : dragging machine. But this works nice as is.

export const DraggingContext = createContext<{
  isDragging: boolean;
  draggingId: string | null;
  setIsDragging: (isDragging: boolean) => void;
  setDraggingId: (draggingId: string | null) => void;
}>({
  isDragging: false,
  setIsDragging: () => {},
  setDraggingId: () => {},
  draggingId: null,
});

DraggingContext.displayName = "DraggingContext";

export const World = () => {
  const refFloor = useRef<Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<null | string>(null);

  const service = useGameMachineProvider();
  const PISS_COUNT = useSelector(service, (state) => state.context.PISS_COUNT);

  // const dummyBoxes = useMemo(
  //   () =>
  //     Array.from({ length: 50 }, (_, i) => ({
  //       i,
  //       scaleY: Math.random() * 3 + 1,
  //       pos: new Vector3(
  //         Math.random() * 50 - 25,
  //         -0.5,
  //         Math.random() * 50 - 25
  //       ),
  //     })),
  //   []
  // );

  return (
    <DraggingContext.Provider
      value={{ isDragging, setIsDragging, setDraggingId, draggingId }}
    >
      {!isDragging && <OrbitControls />}

      <Floor
        ref={refFloor}
        onPointerUp={() => {
          setIsDragging(false);
          setDraggingId(null);
        }}
      />

      <Person refFloor={refFloor} pos={new Vector3(9, 0, 5)} />
      <Person refFloor={refFloor} pos={new Vector3(-3, 0, 0)} />
      <Person refFloor={refFloor} pos={new Vector3(-1, 0, 5)} />
      <Person refFloor={refFloor} pos={new Vector3(-10, 0, 10)} />

      <Text color={"red"} position-y={3} scale={10}>
        {PISS_COUNT}
      </Text>
      {/* {dummyBoxes.map(({ i, scaleY, pos }) => ( */}
      <Hotspot type="battery" dropSpotQuality={5} position={[-6, 0, -7]} />
      <Hotspot type="drink" dropSpotQuality={7} position={[3, 0, -10]} />
      <Hotspot type="battery" dropSpotQuality={3} position={[3, 0, 10]} />
      {/* ))} */}
    </DraggingContext.Provider>
  );
};
