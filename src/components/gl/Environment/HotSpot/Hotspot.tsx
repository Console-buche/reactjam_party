import { useId, useRef, useState } from "react";
import { Mesh } from "three";
import { DropSpots } from "./DropSpots";
import { DropSpotQuality, HotSpot } from "./types";
import { MeshProps } from "@react-three/fiber";

type HotSpotProps = {
  type: HotSpot;
  dropSpotQuality: DropSpotQuality;
} & MeshProps;

export const Hotspot = ({ type, dropSpotQuality, ...props }: HotSpotProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // const { isDragging, setIsDragging } = useContext(DraggingContext);
  // TODO : get tex from type
  const refHotSpot = useRef<Mesh>(null);
  const uuid = useId();

  return (
    <group>
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        ref={refHotSpot}
        uuid={uuid}
        onPointerDown={() => {}}
        onPointerUp={() => {}}
        {...props}
      >
        <boxBufferGeometry args={[2, 1]} />
        <meshBasicMaterial color={isHovered ? "hotpink" : "black"} />
        {isHovered && <DropSpots DropSpotQuaity={dropSpotQuality} />}
      </mesh>
    </group>
  );
};
