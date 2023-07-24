import { MeshProps } from '@react-three/fiber';
import {
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { CircleGeometry, Mesh } from 'three';
import { getPositionsOnCircle } from '../../../../helpers/getPositionOnCircle';
import { DraggingContext } from '../../World/World';
import { DropSpots } from '../DropSpots/DropSpots';
import { DROPSPOT_SIZE, RING_SIZE } from '../DropSpots/dropSpots.constants';
import { DropSpotQuality, HotSpot } from './types';

type HotSpotProps = {
  type: HotSpot;
  dropSpotQuality: DropSpotQuality;
  onDropHotspot: () => void;
} & MeshProps;

type State = {
  personsIdsOnSpot: Set<string>;
  spotIdsAndAvailability: Map<number, boolean>;
};

type Action =
  | {
      type: 'ADD';
      payload: {
        uuid: string;
        isDragging: boolean;
        onHotSpotDrop: () => void;
        spotId: number;
      };
    }
  | { type: 'REMOVE'; payload: string }; // TODO

// TODO : removing happens when person is dragged & dropped outside of the dropspot

function hopSpotReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      if (!action.payload.isDragging) {
        return state;
      }
      const personsIdsOnSpot = new Set(
        ...state.personsIdsOnSpot,
        action.payload.uuid,
      );

      const currentSpotIds = new Map(state.spotIdsAndAvailability);
      currentSpotIds.set(action.payload.spotId, false);
      const spotIdsAndAvailability = currentSpotIds;

      action.payload.onHotSpotDrop();
      return {
        personsIdsOnSpot,
        spotIdsAndAvailability,
      };

    case 'REMOVE':
      // TODO
      return state;

    default:
      return state;
  }
}

export const Hotspot = ({
  type,
  dropSpotQuality,
  onDropHotspot,
  ...props
}: HotSpotProps) => {
  const refHotSpotGeometry = useRef<CircleGeometry>(null);
  const refHotSpot = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { isDragging, draggingRef, draggingId } = useContext(DraggingContext);
  const uuid = useId();

  const isExists = useRef(false);

  // setup transforms
  useEffect(() => {
    if (!refHotSpotGeometry.current || isExists.current) {
      return;
    }
    refHotSpotGeometry.current.rotateX(Math.PI * -0.5);
    isExists.current = true;
  }, [isExists]);

  const positions = useMemo(
    () =>
      Array.from({ length: dropSpotQuality }, (_, i) => ({
        pos: getPositionsOnCircle(
          RING_SIZE - DROPSPOT_SIZE * 0.25,
          dropSpotQuality,
          i,
        ),
        uuid: `${uuid}-${i}}`,
      })),
    [],
  );

  const [_, dispatch] = useReducer<React.Reducer<State, Action>>(
    hopSpotReducer,
    {
      personsIdsOnSpot: new Set(),
      spotIdsAndAvailability: new Map([...positions].map((_, i) => [i, true])),
    },
  );

  return (
    <group position-y={-1.1}>
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        ref={refHotSpot}
        uuid={uuid}
        onClick={() => {
          onDropHotspot();

          // const availableSpotId = Array.from(
          //   _.spotIdsAndAvailability.entries(),
          // ).find(([, isAvailable]) => isAvailable)?.[0];
          // dispatch({
          //   type: 'ADD',
          //   payload: {
          //     uuid,
          //     spotId: availableSpotId ?? 0, // FIXME : PERSONS shouldn't stack. If no available spot: do somthing.
          //     isDragging,
          //     onHotSpotDrop: () => {
          //       const worldPosition = refHotSpot.current?.localToWorld(
          //         positions[availableSpotId ?? 0].pos.clone(),
          //       );
          //       if (!worldPosition) {
          //         return;
          //       }
          //       const newPos = worldPosition.clone().setY(0);
          //       draggingRef?.position.set(...newPos.toArray());
          //     },
          //   },
          // });
        }}
        onPointerDown={() => {}}
        {...props}
      >
        <circleBufferGeometry args={[RING_SIZE, 16]} ref={refHotSpotGeometry} />
        <meshBasicMaterial transparent opacity={0.3} color="black" />
        {isHovered && <DropSpots positions={positions} />}
      </mesh>
    </group>
  );
};
