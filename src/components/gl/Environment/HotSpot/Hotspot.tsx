import type { MeshProps } from '@react-three/fiber';
import {
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import type { CircleGeometry, Mesh } from 'three';
import { getPositionsOnCircle } from '../../../../helpers/getPositionOnCircle';
import { DropSpots } from '../DropSpots/DropSpots';
import { DROPSPOT_SIZE, RING_SIZE } from '../DropSpots/dropSpots.constants';
import {
  type ReducerActionHotSpot,
  type ReducerStateHotSpot,
  hopSpotReducer,
} from './hotSpot.reducer';
import { DraggingContext } from '../../World/World';

type HotSpotProps = {
  slotsAmount: number;
  onDropHotspot: () => void;
} & MeshProps;

export const Hotspot = ({
  onDropHotspot,
  slotsAmount,
  ...props
}: HotSpotProps) => {
  const refHotSpotGeometry = useRef<CircleGeometry>(null);
  const refHotSpot = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { isDragging, draggingRef } = useContext(DraggingContext);
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
      Array.from({ length: slotsAmount }, (_, i) => ({
        pos: getPositionsOnCircle(
          RING_SIZE - DROPSPOT_SIZE * 0.25,
          slotsAmount,
          i,
        ),
        uuid,
      })),
    [],
  );

  const [state, dispatch] = useReducer<
    React.Reducer<ReducerStateHotSpot, ReducerActionHotSpot>
  >(hopSpotReducer, {
    personsIdsOnSpot: new Set(),
    spotIdsAndAvailability: new Map([...positions].map((_, i) => [i, true])),
  });

  return (
    <group position-y={-1.1}>
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        ref={refHotSpot}
        uuid={uuid}
        onClick={() => {
          onDropHotspot();

          const availableSpotId = Array.from(
            state.spotIdsAndAvailability.entries(),
          ).find(([, isAvailable]) => isAvailable)?.[0];

          dispatch({
            type: 'ADD',
            payload: {
              uuid,
              spotId: availableSpotId ?? 0, // FIXME : PERSONS shouldn't stack. If no available spot: do something.
              isDragging,
              onHotSpotDrop: () => {
                const worldPosition = refHotSpot.current?.localToWorld(
                  positions[availableSpotId ?? 0].pos.clone(),
                );
                if (!worldPosition) {
                  return;
                }
                const newPos = worldPosition.clone().setY(0);
                draggingRef?.position.set(...newPos.toArray());
              },
            },
          });
        }}
        onPointerDown={() => {}}
        {...props}
      >
        <circleBufferGeometry args={[RING_SIZE, 16]} ref={refHotSpotGeometry} />
        <meshBasicMaterial transparent opacity={0.3} color="black" />

        {/* TODO : make dropspots visible/part of the UI/UX or just remove them from graphics */}
        {isHovered && <DropSpots positions={positions} />}
      </mesh>
    </group>
  );
};
