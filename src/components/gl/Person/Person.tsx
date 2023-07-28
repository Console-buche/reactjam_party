import { a, useSpring } from '@react-spring/three';
import { Html, Text, useCursor, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useControls } from 'leva';
import { useEffect, useRef, useState } from 'react';
import {
  BufferGeometry,
  Group,
  Material,
  MathUtils,
  Mesh,
  Vector3,
} from 'three';
import type { ActorRefFrom } from 'xstate';
import { shallow } from 'zustand/shallow';
import type { personMachine } from '../../../machines/person.machine';
import { useStoreDragging } from '../../../stores/storeDragging';
import { PersonShadowRecall } from './PersonShadowRecall';
import { Statbar } from './Statbar';
import { PERSON_HEIGHT } from './person.constants';

const selectFeedbackIntensiry = (
  isHovered: boolean,
  isBeingDragged: boolean,
) => {
  if (isHovered) {
    return 8;
  }
  if (isBeingDragged) {
    return 4;
  }
  return 0;
};

// const selectFeedbackScale = (
//   isBeingDragged: boolean,
//   currentHotSpotIt: string,
// ) => {
//   if (currentHotSpotIt !== '') {
//     return 0.9;
//   }
//   if (isBeingDragged) {
//     return 0.65;
//   }
//   return 0.75;
// };

export const Person = ({
  refFloor,
  pos,
  actor,
}: {
  refFloor: React.RefObject<Mesh<BufferGeometry, Material | Material[]>>;
  pos?: Vector3;
  actor: ActorRefFrom<typeof personMachine>;
}) => {
  const { showActionButtons } = useControls({ showActionButtons: false });
  const [isHovered, setIsHovered] = useState(false);
  useCursor(isHovered);

  const isExists = useRef(false);

  const {
    isDragging,
    draggingId,
    setDraggingActorRef,
    setDraggingId,
    setDraggingRef,
    setIsDragging,
    setIsHoveringPerson,
  } = useStoreDragging(
    (state) => ({
      isDragging: state.isDragging,
      setIsDragging: state.setIsDragging,
      setDraggingActorRef: state.setDraggingActorRef,
      draggingId: state.draggingId,
      setDraggingId: state.setDraggingId,
      setDraggingRef: state.setDraggingRef,
      setIsHoveringPerson: state.setIsHoveringPerson,
    }),
    shallow,
  );

  const ref = useRef<Mesh>(null);
  const beforeDragPosition = useRef<Vector3>(new Vector3(0, 0, 0));
  const refGroup = useRef<Group>(null);
  const tex = useTexture('assets/dudess.png');
  const serviceId = actor.id;

  const {
    meters: { hype, pee, thirst },
    name,
  } = useSelector(actor, (state) => state.context);

  const isBeingDragged = draggingId === serviceId;

  // setup easings
  const { glow, scale } = useSpring({
    glow: selectFeedbackIntensiry(isHovered, isBeingDragged),
    scale: 1,
    // scale: selectFeedbackScale(isBeingDragged, hotspot),
  });

  // position tick for the drag back shadow
  useEffect(() => {
    if (isBeingDragged && refGroup.current) {
      beforeDragPosition.current.copy(refGroup.current.position);
    }
  }, [isBeingDragged]);

  // init position & transform offsets
  useEffect(() => {
    if (ref.current && refGroup.current && !isExists.current) {
      ref.current.geometry.translate(0, PERSON_HEIGHT * 0.5, 0);
      refGroup.current.position.copy(pos || new Vector3(-26, 0, 11));
      isExists.current = true;
      actor.send('triggerStart');
    }
  }, [isExists, pos, actor]);

  useFrame(({ camera, clock }) => {
    if (!ref.current || !refGroup.current || !refFloor) {
      return;
    }

    // wobble
    ref.current.lookAt(new Vector3(camera.position.x, 0, camera.position.z));
    ref.current.scale.y =
      Math.sin(clock.getElapsedTime() * 10) * 0.01 + scale.get();

    if (isBeingDragged) {
      refGroup.current.position.lerp(
        new Vector3(camera.position.x, 3, 11),
        0.75,
      );
    }
    // height
    if (!isBeingDragged) {
      refGroup.current.position.y = MathUtils.lerp(
        ref.current.position.y,
        -9,
        0.2,
      );
    }
  });

  const handleOnClick = () => {
    if (!isDragging) {
      setIsDragging(true);
      setDraggingRef(refGroup.current);
      setDraggingActorRef(actor);

      if (refGroup.current) {
        setDraggingId(serviceId);
        beforeDragPosition.current.copy(refGroup.current.position);
      }
    } else {
      setIsDragging(false);
      setDraggingId(null);
      setDraggingActorRef(null);
    }
  };

  const handleOnPointerEnter = () => {
    setIsHovered(true);
    setIsHoveringPerson(true);
  };

  const handleOnPointerLeave = () => {
    setIsHovered(false);
    setIsHoveringPerson(false);
  };

  return (
    <>
      <group
        ref={refGroup}
        onPointerEnter={handleOnPointerEnter}
        onPointerLeave={handleOnPointerLeave}
      >
        <a.mesh
          ref={ref}
          uuid={serviceId}
          onPointerDown={handleOnClick}
          scale={scale}
          name="Person"
        >
          <planeBufferGeometry args={[3, PERSON_HEIGHT]} />
          {/* @ts-ignore */}
          <a.meshStandardMaterial
            map={tex}
            transparent
            alphaTest={0.1}
            toneMapped={false}
            emissive={'purple'}
            emissiveIntensity={glow}
            emissiveMap={tex}
          />
        </a.mesh>
        <Statbar position-y={4} value={thirst} />
        <Statbar position-y={4.25} value={pee} />
        <Statbar position-y={4.5} value={hype} />

        <Text fontSize={0.5} position-y={3} color="yellow">
          {name}
        </Text>

        {/* Debug  */}
        {showActionButtons && (
          <Html>
            <button
              style={{ position: 'absolute', right: -100, top: 0 }}
              type={'button'}
              onClick={() => actor.send({ type: 'onDrag' })}
            >
              On Drag
            </button>
            <button
              style={{ position: 'absolute', right: -100, top: 20 }}
              type={'button'}
              onClick={() => actor.send({ type: 'onDrop', action: 'drink' })}
            >
              Dropped
            </button>
          </Html>
        )}
      </group>
      <PersonShadowRecall
        beforeDragPosition={beforeDragPosition.current}
        isBeingDragged={isBeingDragged}
      />
    </>
  );
};
