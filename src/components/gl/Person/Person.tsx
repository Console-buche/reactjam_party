import { a, useSpring } from '@react-spring/three';
import { Html, useCursor, useTexture } from '@react-three/drei';
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
  } = useStoreDragging(
    (state) => ({
      isDragging: state.isDragging,
      setIsDragging: state.setIsDragging,
      setDraggingActorRef: state.setDraggingActorRef,
      draggingId: state.draggingId,
      setDraggingId: state.setDraggingId,
      setDraggingRef: state.setDraggingRef,
    }),
    shallow,
  );

  const ref = useRef<Mesh>(null);
  const beforeDragPosition = useRef<Vector3>(new Vector3(0, 0, 0));
  const refGroup = useRef<Group>(null);
  const tex = useTexture('assets/dudess.png');
  const serviceId = actor.id;

  const { hype, pee, thirst } = useSelector(
    actor,
    (state) => state.context.meters,
  );

  const isBeingDragged = draggingId === serviceId;
  // setup easings

  const { glow, scale } = useSpring({
    glow: selectFeedbackIntensiry(isHovered, isBeingDragged),
    scale: isBeingDragged ? 0.75 : 0.9,
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
      refGroup.current.position.copy(pos || new Vector3(-31, 0, 11.5));
      isExists.current = true;
      actor.send('triggerStart');
    }
  }, [isExists, pos, actor]);

  useFrame(({ camera, clock }) => {
    if (!ref.current || !refGroup.current || !refFloor) {
      return;
    }

    if (isBeingDragged) {
      refGroup.current.position.lerp(
        new Vector3(camera.position.x, refGroup.current.position.y, 11),
        0.75,
      );
    }

    // wobble
    ref.current.lookAt(new Vector3(camera.position.x, 0, camera.position.z));
    ref.current.scale.y =
      Math.sin(clock.getElapsedTime() * 10) * 0.01 + scale.get();

    // height
    if (!isBeingDragged) {
      ref.current.position.y = MathUtils.lerp(
        ref.current.position.y,
        PERSON_HEIGHT * -0.25,
        0.2,
      );
    }
  });

  const handleOnClick = () => {
    if (!isDragging) {
      setIsDragging(true);
      setDraggingRef(refGroup.current);
      setDraggingActorRef(actor);
      actor.send({ type: 'onUnregisterHotspot' });

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

  return (
    <>
      <group
        ref={refGroup}
        onPointerOver={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <a.mesh
          ref={ref}
          uuid={serviceId}
          onPointerDown={handleOnClick}
          scale={scale}
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
        <Statbar position-y={6} value={thirst} />
        <Statbar position-y={6.25} value={pee} />
        <Statbar position-y={6.5} value={hype} />

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
