import { a, useSpring } from '@react-spring/three';
import { Box, Html, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useControls } from 'leva';
import { useEffect, useRef } from 'react';
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
  const refShadow = useRef<Mesh>(null);
  const tex = useTexture('assets/dudess.png');
  const serviceId = actor.id;

  const { hype, pee, thirst } = useSelector(
    actor,
    (state) => state.context.meters,
  );

  const isBeingDragged = draggingId === serviceId;

  // init easings
  const shadow = useSpring({
    opacity: isBeingDragged ? 0.9 : 0.1,
    color: isBeingDragged ? '#FFA500' : 'grey',
    scale: isBeingDragged
      ? ([1.25, 1.25, 1.25] as const)
      : ([0.75, 0.75, 0.75] as const),
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
      refGroup.current.position.copy(pos || new Vector3(-31, 0, 9));
      isExists.current = true;
      actor.send('triggerStart');
    }
  }, [isExists, pos, actor]);

  useFrame(({ raycaster, camera, clock }) => {
    if (!ref.current || !refGroup.current || !refFloor) {
      return;
    }

    const intersects =
      refFloor.current && raycaster.intersectObject(refFloor.current);

    // drag
    // if (intersects && intersects.length > 0 && isBeingDragged) {
    //   const [intersect] = intersects;
    //   if (isDragging) {
    //     const newGroupPos = new Vector3(
    //       intersect.point.x,
    //       0,
    //       intersect.point.z,
    //     );
    //     refGroup.current.position.lerp(newGroupPos, 0.1);
    //     ref.current.position.y = MathUtils.lerp(
    //       ref.current.position.y,
    //       PERSON_HEIGHT * 0.15,
    //       0.2,
    //     );
    //   }
    // }

    if (isDragging) {
      refGroup.current.position.lerp(
        new Vector3(camera.position.x, refGroup.current.position.y, 8),
        0.75,
      );
    }

    // wobble
    ref.current.lookAt(new Vector3(camera.position.x, 0, camera.position.z));
    ref.current.scale.y = Math.sin(clock.getElapsedTime() * 10) * 0.05 + 1;

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
      <group ref={refGroup}>
        <mesh ref={ref} uuid={serviceId} onPointerDown={handleOnClick}>
          <planeBufferGeometry args={[3, PERSON_HEIGHT]} />
          <meshBasicMaterial map={tex} transparent alphaTest={0.1} />
        </mesh>
        <Statbar position-y={6} value={thirst} />
        <Statbar position-y={6.25} value={pee} />
        <Statbar position-y={6.5} value={hype} />

        <a.mesh
          ref={refShadow}
          rotation-x={Math.PI * -0.5}
          position-y={-0.9}
          scale={shadow.scale}
        >
          <circleBufferGeometry />

          {/* @ts-ignore */}
          <a.meshLambertMaterial
            transparent
            opacity={shadow.opacity}
            depthWrite={false}
            color={shadow.color}
          />
        </a.mesh>

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
