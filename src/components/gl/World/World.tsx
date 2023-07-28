import { Box } from '@react-three/drei';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { Suspense, useRef } from 'react';
import { Vector3, type Mesh } from 'three';
import type { ActorRefFrom } from 'xstate';
import { shallow } from 'zustand/shallow';
import { useGameMachineProvider } from '../../../hooks/use';
import type { hotspotMachine } from '../../../machines/hotspot.machine';
import { useStoreDragging } from '../../../stores/storeDragging';
import { useStoreHotspot } from '../../../stores/storeHotspots';
import { AppartmentV6 } from '../House/Appartment_v6';
import { Person } from '../Person/Person';
import { PostProcess } from '../postProcess/PostProcess';
import { Cam } from './Cam';

export const World = () => {
  const { raycaster, scene } = useThree();

  // const { x, y, z } = useControls({
  //   x: {
  //     step: 0.1,
  //     value: 0,
  //     min: -20,
  //     max: 40,
  //   },
  //   y: {
  //     step: 0.1,
  //     value: 0,
  //     min: -60,
  //     max: 60,
  //   },
  //   z: {
  //     step: 0.1,
  //     value: 12,
  //     min: -10,
  //     max: 14,
  //   },
  // });

  const refFloor = useRef<Mesh>(null);
  const gameService = useGameMachineProvider();
  const persons = useSelector(gameService, (state) => state.context.persons);

  const dropZones = useStoreHotspot((state) => state.hotspots);
  const {
    isDragging,
    draggingActorRef,
    setDraggingActorRef,
    setDraggingId,
    setIsDragging,
  } = useStoreDragging(
    (state) => ({
      isDragging: state.isDragging,
      setIsDragging: state.setIsDragging,
      setDraggingActorRef: state.setDraggingActorRef,
      draggingId: state.draggingId,
      setDraggingId: state.setDraggingId,
      draggingActorRef: state.draggingActorRef,
    }),
    shallow,
  );
  const handleOnClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    // find intersects on the sene
    const intersects = raycaster.intersectObject(scene);
    if (intersects.length === 0) {
      return;
    }

    // filter out clicked hotspots and persons by the ray
    const hotspot = intersects.find(({ object }) => object.name === 'Hotspot');

    // on dropping a person on a hotspot
    if (hotspot && isDragging && draggingActorRef) {
      const serviceHotspot = hotspot.object.userData.service as ActorRefFrom<
        typeof hotspotMachine
      >;

      serviceHotspot.send({
        type: 'onRegisterPerson',
        person: draggingActorRef,
      });
      setDraggingId(null);
      setIsDragging(false);
      setDraggingActorRef(null);
    }
  };

  const zones = Object.entries(dropZones).flatMap(
    ([_, data]) => data.dropzones,
  );

  return (
    <group onClick={handleOnClick}>
      <Cam />

      {zones.map((pos, i) => (
        <Box position={pos} key={i} />
      ))}

      <AppartmentV6 ref={refFloor} position-y={-0.5} />
      {/* <DropZones /> */}
      <Suspense fallback={null}>
        {persons.map((actor) => (
          <Person key={actor.id} refFloor={refFloor} actor={actor} />
        ))}
      </Suspense>

      <PostProcess />
    </group>
  );
};
