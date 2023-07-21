import {
  useContext,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Mesh } from "three";
import { DropSpots } from "../DropSpots/DropSpots";
import { DropSpotQuality, HotSpot } from "./types";
import { MeshProps } from "@react-three/fiber";
import { DraggingContext } from "../../World/World";
import { getPositionsOnCircle } from "../../../../helpers/getPositionOnCircle";
import { DROPSPOT_SIZE, RING_SIZE } from "../DropSpots/dropSpots.constants";

type HotSpotProps = {
  type: HotSpot;
  dropSpotQuality: DropSpotQuality;
} & MeshProps;

type Action =
  | {
      type: "ADD";
      payload: { uuid: string; isDragging: boolean; onHotSpotDrop: () => void };
    }
  | { type: "REMOVE"; payload: string }; // TODO

type DropSpot = {
  spotsSet: Set<string>;
};

// TODO : removing happens when person is dragged & dropped outside of the dropspot

function hopSpotReducer(state: Set<string>, action: Action) {
  switch (action.type) {
    case "ADD":
      if (!action.payload.isDragging) {
        return state;
      }
      const updatedSet = new Set(state.add(action.payload.uuid));
      action.payload.onHotSpotDrop();
      console.log("dropped");
      return updatedSet;

    case "REMOVE":
      // TODO
      return state;

    default:
      return state;
  }
}

export const Hotspot = ({ type, dropSpotQuality, ...props }: HotSpotProps) => {
  const { isDragging, draggingRef } = useContext(DraggingContext);

  const [isHovered, setIsHovered] = useState(false);
  const [_, dispatch] = useReducer<React.Reducer<Set<string>, Action>>(
    hopSpotReducer,
    new Set()
  );

  const refHotSpot = useRef<Mesh>(null);
  const uuid = useId();

  const positions = useMemo(
    () =>
      Array.from({ length: dropSpotQuality }, (_, i) => ({
        pos: getPositionsOnCircle(
          RING_SIZE - DROPSPOT_SIZE * 0.25,
          dropSpotQuality,
          i
        ),
        uuid: `${uuid}-${i}}`,
      })),
    []
  );

  return (
    <group>
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        ref={refHotSpot}
        uuid={uuid}
        onPointerUp={() =>
          dispatch({
            type: "ADD",
            payload: {
              uuid,
              isDragging,
              onHotSpotDrop: () =>
                draggingRef?.position.set(...positions[0].pos.toArray()),
            },
          })
        }
        onPointerDown={() => {}}
        {...props}
      >
        <boxBufferGeometry args={[2, 1]} />
        <meshBasicMaterial color={isHovered ? "hotpink" : "black"} />
        {isHovered && <DropSpots positions={positions} />}
      </mesh>
    </group>
  );
};
