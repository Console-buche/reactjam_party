import { a, useSpring } from '@react-spring/three';
import type { MeshProps } from '@react-three/fiber';
import { useInterpret } from '@xstate/react';
import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStoreDragging } from '../../../../stores/storeDragging';
import type { AppartmentHotSpot } from './types';

export const AppartmentHotspot = ({
  geometry,
  materials,
  hotSpotMachine,
  ...props
}: AppartmentHotSpot & MeshProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const service = useInterpret(hotSpotMachine);

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
    glow: isHovered ? 2 : 1,
    scale: isHovered ? [1, 1.05, 1.05] : [1, 1, 1],
  });

  const handleOnClick = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggingId(null);

      draggingActorRef &&
        service.send({ type: 'onAddPerson', person: draggingActorRef });
    }
  };

  return (
    // @ts-ignore
    <a.group scale={scale} onClick={handleOnClick}>
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        geometry={geometry}
        material={materials}
        {...props}
      >
        {/* @ts-ignore */}
        <a.meshLambertMaterial
          map={materials.map} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          alphaTest={0.1}
          transparent
          toneMapped={false}
          emissive={0xffffff}
          emissiveMap={materials.map}
          emissiveIntensity={glow}
        />
      </mesh>
    </a.group>
  );
};
