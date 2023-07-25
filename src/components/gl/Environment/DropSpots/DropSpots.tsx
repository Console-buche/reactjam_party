import { useId, useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import { DropSpot } from './DropSpot';
import { DROPSPOT_SIZE, RING_SIZE, RING_WIDTH } from './dropSpots.constants';

export const DropSpots = ({
  positions,
}: {
  positions: {
    pos: Vector3;
    uuid: string;
  }[];
}) => {
  const refDropSpot = useRef<Mesh>(null);
  const uuid = useId();

  return (
    <group>
      <mesh ref={refDropSpot} uuid={uuid} rotation-x={Math.PI * -0.5}>
        <ringBufferGeometry args={[RING_SIZE, RING_SIZE + RING_WIDTH, 32]} />
        <meshBasicMaterial color="purple" />
      </mesh>
      {positions.map(({ pos, uuid }) => (
        <DropSpot pos={pos} key={uuid} size={DROPSPOT_SIZE} />
      ))}
    </group>
  );
};
