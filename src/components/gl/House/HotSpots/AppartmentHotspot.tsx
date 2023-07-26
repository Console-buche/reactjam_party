import { a, easings, useSpring } from '@react-spring/three';
import { useCursor } from '@react-three/drei';
import { type MeshProps } from '@react-three/fiber';
import { useInterpret } from '@xstate/react';
import { useRef, useState } from 'react';
import type { Mesh } from 'three';
import { shallow } from 'zustand/shallow';
import { useStoreDragging } from '../../../../stores/storeDragging';
import type { AppartmentHotSpot } from './types';

export const AppartmentHotspot = ({
  geometry,
  hotSpotMachine,
  materials,
  ...props
}: AppartmentHotSpot & MeshProps) => {
  const refMesh = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const service = useInterpret(hotSpotMachine);
  useCursor(isHovered);

  const {
    setIsDragging,
    isDragging,
    setDraggingId,
    draggingActorRef,
    isHoveringPerson,
  } = useStoreDragging(
    (state) => ({
      isDragging: state.isDragging,
      setDraggingId: state.setDraggingId,
      setIsDragging: state.setIsDragging,
      draggingActorRef: state.draggingActorRef,
      isHoveringPerson: state.isHoveringPerson,
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
    loop: isDragging || isHovered,
    config: {
      easing: easings.easeInOutSine,
      duration: 350,
    },
  });

  const handleOnClick = () => {
    if (isHoveringPerson) {
      return;
    }
    setIsDragging(false);
    setDraggingId(null);

    draggingActorRef &&
      service.send({
        type: 'onAddPerson',
        person: draggingActorRef,
      });
  };

  const handleOnPointerEnter = () => {
    setIsHovered(true);
  };

  const handleOnPointerLeave = () => {
    setIsHovered(false);
  };

  return (
    // @ts-ignore
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
        name="hotspot"
      />
    </a.group>
  );
};
