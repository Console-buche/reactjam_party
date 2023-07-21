import { Sphere } from "@react-three/drei";
import { useId, useMemo, useRef } from "react";
import { Mesh } from "three";
import { DropSpotQuality } from "./types";
import { getPositionsOnCircle } from "../../../../helpers/getPositionOnCircle";
import { MeshProps } from "@react-three/fiber";

const DROPSPOT_SIZE = 0.5;
const RING_SIZE = 3;
const RING_WIDTH = 0.1;
/**
 * DropSpot is made of an outline
 * And a given spots count, based on the quality
 */
export const DropSpots = ({
  DropSpotQuaity,
}: {
  DropSpotQuaity: DropSpotQuality;
}) => {
  // const { isDragging, setIsDragging } = useContext(DraggingContext);
  // TODO : get tex from type
  const refDropSpot = useRef<Mesh>(null);
  const uuid = useId();

  const positions = useMemo(
    () =>
      Array.from({ length: DropSpotQuaity }, (_, i) => ({
        pos: getPositionsOnCircle(
          RING_SIZE - DROPSPOT_SIZE * 0.25,
          DropSpotQuaity,
          i
        ),
        uuid: `${uuid}-${i}}`,
      })),
    []
  );

  return (
    <group>
      <mesh
        ref={refDropSpot}
        uuid={uuid}
        onPointerDown={() => {}}
        onPointerUp={() => {}}
        rotation-x={Math.PI * -0.5}
      >
        <ringBufferGeometry args={[RING_SIZE, RING_SIZE + RING_WIDTH, 32]} />
        <meshBasicMaterial color="purple" />
      </mesh>
      {positions.map(({ pos, uuid }) => (
        <Sphere
          args={[DROPSPOT_SIZE, 32, 32]}
          material-color="blue"
          position={pos}
          key={uuid}
        />
      ))}
    </group>
  );
};
