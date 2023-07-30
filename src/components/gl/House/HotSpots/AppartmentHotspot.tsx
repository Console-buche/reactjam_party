import { a, easings, useSpring } from '@react-spring/three';
import { useCursor } from '@react-three/drei';
import { useFrame, type MeshProps } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useRef, useState } from 'react';
import { type Mesh } from 'three';
import { shallow } from 'zustand/shallow';
import { useGameMachineProvider } from '../../../../hooks/use';
import { useStoreDragging } from '../../../../stores/storeDragging';
import { useStoreHotspot } from '../../../../stores/storeHotspots';
import type { AppartmentHotSpot } from './types';

export const AppartmentHotspot = ({
  type,
  geometry,
  materials,
  stats,
  ...props
}: AppartmentHotSpot & MeshProps) => {
  const refMesh = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  const {
    getAvailableDropZone,
    updateDropZoneOccupied,
    cleanupHotspotDropzoneFromRemovedPersons,
  } = useStoreHotspot(
    (state) => ({
      updateDropZoneOccupied: state.updateDropZoneOccupied,
      updateHotSpotPosition: state.updateHotSpotPosition,
      dropzonegetAvailableDropZone: state.getAvailableDropZone,
      getAvailableDropZone: state.getAvailableDropZone,
      cleanupHotspotDropzoneFromRemovedPersons:
        state.cleanupHotspotDropzoneFromRemovedPersons,
    }),
    shallow,
  );
  const gameService = useGameMachineProvider();
  const hotspotService = useSelector(
    gameService,
    (state) => state.context.hotspots[type],
  );

  const { persons, maxPersons } = useSelector(hotspotService, (s) => s.context);

  useFrame(({ clock }) => {
    if (Math.floor(clock.getElapsedTime()) % 2 === 0) {
      cleanupHotspotDropzoneFromRemovedPersons(
        type,
        persons.map((p) => p.id),
      );
    }
  });

  const {
    draggingActorRef,
    setDraggingActorRef,
    setDraggingId,
    setIsDragging,
    draggingRef,
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

  // FIXME : handle register impossible when hopspot is full
  const handleOnClick = () => {
    if (persons.length === maxPersons) {
      return;
    }
    // on dropping a person on a hotspot
    if (isDragging && draggingActorRef) {
      // register person in hotspot
      hotspotService.send({
        type: 'onRegisterPerson',
        person: draggingActorRef,
      });

      // save state in mesh userData while machine state isn't fixed
      const dropZone = getAvailableDropZone(type);

      if (draggingRef?.userData && dropZone) {
        draggingRef.userData.isIdle = false;
        draggingRef.userData.dropZone = dropZone;
        updateDropZoneOccupied(type, dropZone.index, draggingActorRef.id);
      }

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
      {
        glow: isDragging ? 1.5 : 0,
        scale: isDragging ? [1, 1.025, 1.075] : [1, 1, 1],
      },
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
          // material={materials}
          // material-tonedMapped={false}
          // material-emissive={0xffffff}
          // material-emissiveIntensity={glow}
          // material-map={materials.map}
          // material-emissiveMap={materials.map}
          {...props}
          name="Hotspot"
          userData={{ service: hotspotService }}
        >
          <a.meshStandardMaterial
            {...materials}
            toneMapped={false}
            emissive={0xffffff}
            emissiveIntensity={glow}
            map={materials.map}
            emissiveMap={materials.map}
          />
          {stats({
            maxPersonsCount: maxPersons,
            personsCount: persons.length,
          })}
        </a.mesh>
      </a.group>
    </>
  );
};
