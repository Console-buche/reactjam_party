import { a, easings, useSpring } from '@react-spring/three';
import type { MeshProps } from '@react-three/fiber';
import { useInterpret } from '@xstate/react';
import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStoreDragging } from '../../../../stores/storeDragging';
import type { AppartmentHotSpot } from './types';
import { useCursor } from '@react-three/drei';

const selectFeedbackIntensiry = (isHovered: boolean, isDragging: boolean) => {
  if (isHovered) {
    return 8;
  }
  if (isDragging) {
    return 12;
  }
  return 0;
};

export const AppartmentHotspot = ({
  geometry,
  materials,
  hotSpotMachine,
  ...props
}: AppartmentHotSpot & MeshProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const service = useInterpret(hotSpotMachine);
  useCursor(isHovered);

  // TODO : use below solution when availble ===> registers hotspot machine in game machine
  // const gameMachine = useGameMachineProvider();

  // useEffect(() => {
  // gameMachine.send({ type: 'HOTSPOT_CREATED', service });
  // return () => {
  // gameMachine.send({ type: 'HOTSPOT_DESTROYED', service });
  // };
  // }, []);

  const { setIsDragging, isDragging, setDraggingId, draggingActorRef } =
    useStoreDragging(
      (state) => ({
        isDragging: state.isDragging,
        setDraggingId: state.setDraggingId,
        setIsDragging: state.setIsDragging,
        draggingActorRef: state.draggingActorRef,
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
    if (isDragging) {
      setIsDragging(false);
      setDraggingId(null);

      draggingActorRef &&
        service.send({
          type: 'onAddPerson',
          person: draggingActorRef,
        });
    }
  };

  return (
    // @ts-ignore
    <a.group scale={scale} onClick={handleOnClick}>
      {/* @ts-ignore */}
      <a.mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        geometry={geometry}
        material={materials}
        {...props}
        material-tonedMapped={false}
        material-emissive={0xffffff}
        material-emissiveIntensity={glow}
        material-map={materials.map}
        material-emissiveMap={materials.map}
      />
    </a.group>
  );
};
