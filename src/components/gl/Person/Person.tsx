import { a, useSpring } from '@react-spring/three';
import { Text, useCursor, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
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
import { useGameMachineProvider } from '../../../hooks/use';
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
  const [isHovered, setIsHovered] = useState(false);

  useCursor(isHovered);

  const isExists = useRef(false);

  const gameService = useGameMachineProvider();

  const {
    setDraggingActorRef,
    setDraggingId,
    setIsDragging,
    draggingId,
    setIsHoveringPerson,
    setDraggingRef,
  } = useStoreDragging(
    (state) => ({
      isDragging: state.isDragging,
      draggingId: state.draggingId,
      setIsHoveringPerson: state.setIsHoveringPerson,
      setIsDragging: state.setIsDragging,
      setDraggingActorRef: state.setDraggingActorRef,
      setDraggingId: state.setDraggingId,
      draggingActorRef: state.draggingActorRef,
      setDraggingRef: state.setDraggingRef,
    }),
    shallow,
  );

  const ref = useRef<Mesh>(null);
  const beforeDragPosition = useRef<Vector3>(new Vector3(0, 0, 0));
  const refGroup = useRef<Group>(null);
  const tex = useTexture('assets/dudess.png');
  const serviceId = actor.id;

  const {
    meters: { pee, thirst },
    name,
  } = useSelector(actor, (state) => state.context);

  const isBeingDragged = draggingId === serviceId;

  // setup easings
  const { glow, scale, followSpeed, opacity } = useSpring({
    glow: selectFeedbackIntensiry(isHovered, isBeingDragged),
    scale: isBeingDragged ? 1 : 0.8,
    opacity: isBeingDragged ? 0.5 : 1,
    followSpeed: isBeingDragged ? 0.75 : 0,
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
        new Vector3(camera.position.x, -1, 11),
        followSpeed.get(),
      );
    }
    // height
    if (!isBeingDragged) {
      refGroup.current.position.y = MathUtils.lerp(
        refGroup.current.position.y,
        -1.8,
        0.2,
      );
    }
  });

  const handleOnPointerEnter = () => {
    setIsHovered(true);
    setIsHoveringPerson(true);
  };

  const handleOnPointerLeave = () => {
    setIsHovered(false);
    setIsHoveringPerson(false);
  };

  const handleOnClick = () => {
    if (isBeingDragged) {
      setIsDragging(false);
      setDraggingId(null);
      setDraggingActorRef(null);
      setDraggingRef(null);
      return;
    }

    // find intersects on the sene
    setDraggingRef(refGroup.current);

    setIsDragging(true);
    setDraggingId(actor.id);
    setDraggingActorRef(actor);
    gameService.send({
      type: 'onRemovePersonFromAllHotspots',
      person: actor,
    });
  };

  return (
    <>
      <group
        ref={refGroup}
        onClick={handleOnClick}
        onPointerEnter={handleOnPointerEnter}
        onPointerLeave={handleOnPointerLeave}
      >
        <a.mesh
          ref={ref}
          uuid={serviceId}
          scale={scale}
          name="Person"
          userData={{ service: actor }}
        >
          <planeBufferGeometry args={[3, PERSON_HEIGHT]} />
          {/* @ts-ignore */}
          <a.meshStandardMaterial
            map={tex}
            transparent
            alphaTest={0.1}
            toneMapped={false}
            emissive={'purple'}
            opacity={opacity}
            emissiveIntensity={glow}
            emissiveMap={tex}
          />
        </a.mesh>
        <Statbar position-y={4} value={thirst} />
        <Statbar position-y={4.25} value={pee} />

        <Text fontSize={0.3} position-y={4.75} color="white">
          {name}
          <meshStandardMaterial
            toneMapped={false}
            emissive={'#ffffff'}
            emissiveIntensity={1.2}
          />
        </Text>
      </group>
      <PersonShadowRecall
        beforeDragPosition={beforeDragPosition.current}
        isBeingDragged={isBeingDragged}
      />
    </>
  );
};
