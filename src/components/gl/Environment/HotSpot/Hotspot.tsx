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

type State = {
  personsIdsOnSpot: Set<string>;
  spotIdsAndAvailability: Map<number, boolean>;
};

type Action =
  | {
      type: "ADD";
      payload: {
        uuid: string;
        isDragging: boolean;
        onHotSpotDrop: () => void;
        spotId: number;
      };
    }
  | { type: "REMOVE"; payload: string }; // TODO

// TODO : removing happens when person is dragged & dropped outside of the dropspot

function hopSpotReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      if (!action.payload.isDragging) {
        return state;
      }
      const personsIdsOnSpot = new Set(
        ...state.personsIdsOnSpot,
        action.payload.uuid
      );

      const currentSpotIds = new Map(state.spotIdsAndAvailability);
      currentSpotIds.delete(action.payload.spotId);
      const spotIdsAndAvailability = currentSpotIds;

      action.payload.onHotSpotDrop();
      return {
        personsIdsOnSpot,
        spotIdsAndAvailability,
      };

    case "REMOVE":
      // TODO
      return state;

    default:
      return state;
  }
}

export const Hotspot = ({ type, dropSpotQuality, ...props }: HotSpotProps) => {
  const { isDragging, draggingRef } = useContext(DraggingContext);
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

  const [isHovered, setIsHovered] = useState(false);
  const [_, dispatch] = useReducer<React.Reducer<State, Action>>(
    hopSpotReducer,
    {
      personsIdsOnSpot: new Set(),
      spotIdsAndAvailability: new Map([...positions].map((_, i) => [i, true])),
    }
  );

  // console.log(_);
  const refHotSpot = useRef<Mesh>(null);

  return (
    <group>
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        ref={refHotSpot}
        uuid={uuid}
        onPointerUp={() => {
          const availableSpotId = Array.from(
            _.spotIdsAndAvailability.entries()
          ).find(([, isAvailable]) => isAvailable)?.[0];

          dispatch({
            type: "ADD",
            payload: {
              uuid,
              spotId: availableSpotId ?? 0, // FIXME : PERSONS shouldn't stack. If no available spot: do somthing.
              isDragging,
              onHotSpotDrop: () => {
                const worldPosition = refHotSpot.current?.localToWorld(
                  positions[0].pos.clone()
                );
                if (!worldPosition) {
                  return;
                }
                draggingRef?.position.set(...worldPosition.toArray());
              },
            },
          });
        }}
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
