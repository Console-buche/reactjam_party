import { useMemo, useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { Person } from "../Person/Person";
import { DummyBox } from "./DummyBox";
import { Floor } from "./Floor";

export const World = () => {
  const refFloor = useRef<Mesh>(null);
  const [drag, setDrag] = useState(false);

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
    <>
      <Floor ref={refFloor} setDrag={setDrag} />
      <Person refFloor={refFloor} setDrag={setDrag} drag={drag} />

      {dummyBoxes.map(({ i, scaleY, pos }) => (
        <DummyBox key={i} scale-y={scaleY} position={pos} />
      ))}
    </>
  );
};
