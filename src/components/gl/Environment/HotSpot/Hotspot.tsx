import type { MeshProps } from '@react-three/fiber';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CircleGeometry, Mesh } from 'three';
import { getPositionsOnCircle } from '../../../../helpers/getPositionOnCircle';
import { DropSpots } from '../DropSpots/DropSpots';
import { DROPSPOT_SIZE, RING_SIZE } from '../DropSpots/dropSpots.constants';
import type { ActorRefFrom } from 'xstate';
import type { personMachine } from '../../../../machines/person.machine';

type HotSpotProps = {
  slotsAmount: number;
  onDropHotspot: (person: ActorRefFrom<typeof personMachine>) => void;
} & MeshProps;

// TODO : removing happens when person is dragged & dropped outside of the dropspot
export const Hotspot = ({
  slotsAmount,
  onDropHotspot,
  ...props
}: HotSpotProps) => {
  const refHotSpotGeometry = useRef<CircleGeometry>(null);
  const refHotSpot = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  // const { isDragging, draggingRef, draggingId } = useContext(DraggingContext);
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
        uuid: `${uuid}-${i}}`,
      })),
    [slotsAmount, uuid],
  );

  return (
    <group position-y={-1.1}>
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        ref={refHotSpot}
        uuid={uuid}
        // onClick={() => onDropHotspot()}
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
