import { a, easings, useSpring } from '@react-spring/three';
import { useCursor } from '@react-three/drei';
import { type MeshProps } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useRef, useState } from 'react';
import { type Mesh } from 'three';
import { shallow } from 'zustand/shallow';
import { useGameMachineProvider } from '../../../../hooks/use';
import { useStoreDragging } from '../../../../stores/storeDragging';
import { useStoreHotspot } from '../../../../stores/storeHotspots';
import { AppartmentHotspotStats } from './AppartmentHotspotStats';
import type { AppartmentHotSpot } from './types';

export const AppartmentHotspot = ({
  type,
  geometry,
  materials,
  ...props
}: AppartmentHotSpot & MeshProps) => {
  const refMesh = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { getAvailableDropZone } = useStoreHotspot(
    (state) => ({
      updateDropZoneOccupied: state.updateDropZoneOccupied,
      updateHotSpotPosition: state.updateHotSpotPosition,
      dropzonegetAvailableDropZone: state.getAvailableDropZone,
      getAvailableDropZone: state.getAvailableDropZone,
    }),
    shallow,
  );
  const gameService = useGameMachineProvider();
  const hotspotService = useSelector(
    gameService,
    (state) => state.context.hotspots[type],
  );

  const {
    draggingActorRef,
    setDraggingActorRef,
    setDraggingId,
    setIsDragging,
  } = useStoreDragging(
    (state) => ({
      draggingRef: state.draggingRef,
      isDragging: state.isDragging,
      setIsDragging: state.setIsDragging,
      setDraggingActorRef: state.setDraggingActorRef,
      draggingId: state.draggingId,
      setDraggingId: state.setDraggingId,
      draggingActorRef: state.draggingActorRef,
    }),
    shallow,
  );

  const handleOnClick = () => {
    // on dropping a person on a hotspot
    if (isDragging && draggingActorRef) {
      hotspotService.send({
        type: 'onRegisterPerson',
        person: draggingActorRef,
      });

      setDraggingId(null);
      setIsDragging(false);
      setDraggingActorRef(null);
    }
  };

  useCursor(isHovered);

  const { isDragging } = useStoreDragging(
    (state) => ({
      isDragging: state.isDragging,
    }),
    shallow,
  );

  // setup easings
  const { glow, scale } = useSpring({
    from: { glow: 0, scale: [1, 1, 1] },
    to: [
      { glow: 2, scale: [1, 1.025, 1.075] },
      { glow: 0, scale: [1, 1, 1] },
    ],
    loop: isDragging,
    config: {
      easing: easings.easeInOutSine,
      duration: 350,
    },
  });

  const handleOnPointerEnter = () => {
    if (isDragging) {
      setIsHovered(true);
    }
  };

  const handleOnPointerLeave = () => {
    if (isDragging) {
      setIsHovered(false);
    }
  };

  return (
    <>
      {/* @ts-ignore */}
      <a.group scale={scale} onClick={handleOnClick}>
        {/* @ts-ignore */}
        <a.mesh
          ref={refMesh}
          onPointerEnter={handleOnPointerEnter}
          onPointerLeave={handleOnPointerLeave}
          geometry={geometry}
          material={materials}
          {...props}
          material-tonedMapped={false}
          material-emissive={0xffffff}
          material-emissiveIntensity={glow}
          material-map={materials.map}
          material-emissiveMap={materials.map}
          name="Hotspot"
          userData={{ service: hotspotService }}
        >
          <AppartmentHotspotStats
            service={hotspotService}
            textPosition={[1.25, 5, 1]}
          />
        </a.mesh>
      </a.group>
    </>
  );
};
