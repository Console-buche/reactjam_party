import { a, useSpring } from '@react-spring/three';
import { useCursor } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BufferGeometry,
  Group,
  Material,
  MathUtils,
  Mesh,
  TextureLoader,
  Vector3,
} from 'three';
import type { ActorRefFrom } from 'xstate';
import { shallow } from 'zustand/shallow';
import { personMachine } from '../../../machines/person.machine';
import { useStoreDragging } from '../../../stores/storeDragging';
import { useStoreHotspot } from '../../../stores/storeHotspots';
import { PersonShadowRecall } from './PersonShadowRecall';
import { Statbars } from './Statbars';
import { PERSON_HEIGHT } from './person.constants';
import { useGameMachineProvider } from '../../../hooks/use';

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
  const gameService = useGameMachineProvider();
  // const hotspots = useSelector(gameService, (state) => state.context.hotspots);

  useCursor(isHovered);

  const { updateDropZoneOccupied, clearHotSpotsDropZonesForActor } =
    useStoreHotspot((state) => ({
      updateDropZoneOccupied: state.updateDropZoneOccupied,
      clearHotSpotsDropZonesForActor: state.clearHotSpotsDropZonesForActor,
      getAvailableDropZone: state.getAvailableDropZone,
    }));

  const isExists = useRef(false);

  const {
    setDraggingActorRef,
    setDraggingId,
    setIsDragging,
    draggingId,
    setIsHoveringPerson,
    draggingRef,
    setDraggingRef,
  } = useStoreDragging(
    (state) => ({
      isDragging: state.isDragging,
      draggingRef: state.draggingRef,
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

  const deleteRefOnRemove = (draggingRef: Group) => {
    setIsDragging(false);
    setDraggingId(null);
    setDraggingActorRef(null);
    setDraggingRef(null);
    draggingRef.userData.isIdle = true;
    draggingRef.userData.dropZone = null;
  };

  useEffect(() => {
    gameService.subscribe((state) => {
      const isPersonExists = state.context.persons.find(
        (person) => person.id === actor.id,
      );

      if (
        state.event.type === 'onRemovePerson' &&
        !isPersonExists &&
        draggingRef
      ) {
        deleteRefOnRemove(draggingRef);
      }
    });
  }, []);

  const ref = useRef<Mesh>(null);
  const beforeDragPosition = useRef<Vector3>(new Vector3(0, 0, 0));
  const refGroup = useRef<Group>(null);
  const serviceId = actor.id;

  const {
    meters: { fun, hydration, satiety, urine },
    name,
  } = useSelector(actor, (state) => state.context);

  // const tex = useTexture(`assets/characters/${name}.png`);
  const tex = useMemo(
    () => new TextureLoader().load(`assets/characters/${name}.png`),
    [],
  );
  const isBeingDragged = draggingId === serviceId;

  // setup easings
  const { glow, scale, followSpeed, opacity } = useSpring({
    glow: selectFeedbackIntensiry(isHovered, isBeingDragged),
    scale: isBeingDragged ? [0.8, 0.95, 0.8] : [0.7, 0.8, 0.7],
    opacity: isBeingDragged ? 0.5 : 1,
    followSpeed: isBeingDragged ? 0.75 : 0,
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
      refGroup.current.position.copy(pos || new Vector3(-26, -1.8, 11));
      isExists.current = true;
      // send the person actor to the machine to use context.self
      actor.send({ type: 'triggerStart', person: actor });
    }
  }, [isExists, pos, actor]);

  useFrame(({ camera, clock }) => {
    if (!ref.current || !refGroup.current || !refFloor) {
      return;
    }

    // wobble
    ref.current.lookAt(new Vector3(camera.position.x, 0, camera.position.z));
    ref.current.scale.y =
      Math.sin(clock.getElapsedTime() * 10) * 0.01 + scale.get()[1];

    // position on drag
    if (isBeingDragged) {
      refGroup.current.position.lerp(
        new Vector3(camera.position.x, -1, 11),
        followSpeed.get(),
      );
    }

    // position on not dragged, on active dropzone
    if (
      !isBeingDragged &&
      draggingRef &&
      draggingRef.userData.isIdle === false &&
      draggingRef.userData.dropZone.position
    ) {
      draggingRef.position.lerp(draggingRef.userData.dropZone.position, 0.1);
    }

    // position on not dragged and idle
    if (!isBeingDragged && draggingRef?.userData.isIdle === true) {
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

  const handleOnClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    clearHotSpotsDropZonesForActor(actor.id);
    if (isBeingDragged && draggingRef) {
      deleteRefOnRemove(draggingRef);

      return;
    }

    // find intersects on the sene
    setDraggingRef(refGroup.current);

    setIsDragging(true);
    setDraggingId(actor.id);
    setDraggingActorRef(actor);
    actor.send({
      type: 'onUnregisterFromAllHotspot',
    });

    if (
      draggingRef &&
      draggingRef.userData.dropZone &&
      draggingRef.userData.isIdle
    ) {
      updateDropZoneOccupied(
        draggingRef.userData.dropZone.hotspotType,
        draggingRef.userData.dropZone.index,
        null,
      );
      draggingRef.userData.isIdle = true;
      draggingRef.userData.dropZone = null;
    }
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
          // @ts-ignore
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

        <Statbars
          values={{
            fun: {
              value: fun,

              offsetX: -0.75,
            },
            urine: {
              value: urine,
              offsetX: 0.25,
            },
            satiety: {
              value: satiety,
              offsetX: -0.75,
              offsetY: 1,
            },
            hydration: {
              offsetX: 0.25,
              offsetY: 1,
              value: hydration,
            },
          }}
        />

        {/* <Text fontSize={0.3} position-y={5.75} color="white">
          {name}
          <meshStandardMaterial
            toneMapped={false}
            emissive={'#ffffff'}
            emissiveIntensity={1.2}
          />
        </Text> */}
      </group>
      <PersonShadowRecall
        beforeDragPosition={beforeDragPosition.current}
        isBeingDragged={isBeingDragged}
      />
    </>
  );
};
