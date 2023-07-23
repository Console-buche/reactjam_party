import { a, useSpring } from '@react-spring/three';
import { Html, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useInterpret } from '@xstate/react';
import { useControls } from 'leva';
import { useContext, useEffect, useId, useRef } from 'react';
import {
  BufferGeometry,
  Group,
  Material,
  MathUtils,
  Mesh,
  Vector3,
} from 'three';
import { PersonMachineProvider } from '../../../hooks/use';
import { personMachine } from '../../../machines/person.machine';
import { DraggingContext } from '../World/World';
import { PersonShadowRecall } from './PersonShadowRecall';
import { Statbar } from './Statbar';

const PERSON_HEIGHT = 6;

export const Person = ({
  refFloor,
  pos,
}: {
  refFloor: React.RefObject<Mesh<BufferGeometry, Material | Material[]>>;
  pos?: Vector3;
}) => {
  const { showActionButtons } = useControls({ showActionButtons: false });
  const service = useInterpret(personMachine);

  const isExists = useRef(false);
  const {
    isDragging,
    setIsDragging,
    draggingId,
    setDraggingId,
    setDraggingRef,
  } = useContext(DraggingContext);

  const ref = useRef<Mesh>(null);
  const beforeDragPosition = useRef<Vector3>(new Vector3(0, 0, 0));
  const refGroup = useRef<Group>(null);
  const refShadow = useRef<Mesh>(null);
  const tex = useTexture('assets/dudess.png');
  const uuid = useId();

  const isBeingDragged = draggingId === uuid;

  // setup easings
  const shadow = useSpring({
    opacity: isBeingDragged ? 0.9 : 0.1,
    color: isBeingDragged ? '#FFA500' : 'grey', // orange to grey
    scale: isBeingDragged
      ? ([1.25, 1.25, 1.25] as const)
      : ([0.75, 0.75, 0.75] as const),
  });

  useEffect(() => {
    if (isBeingDragged && refGroup.current) {
      beforeDragPosition.current.copy(refGroup.current.position);
    }
  }, [isBeingDragged]);

  useEffect(() => {
    // init position & transform offsets
    if (ref.current && refGroup.current && !isExists.current) {
      ref.current.geometry.translate(0, PERSON_HEIGHT * 0.5, 0);
      refGroup.current.position.copy(pos || new Vector3(0, 0, 30));
      isExists.current = true;
    }
  }, [isExists, pos]);

  useFrame(({ raycaster, camera, clock }) => {
    if (!ref.current || !refGroup.current || !refFloor) {
      return;
    }

    const intersects =
      refFloor.current && raycaster.intersectObject(refFloor.current);

    // drag
    if (intersects && intersects.length > 0 && isBeingDragged) {
      const [intersect] = intersects;
      if (isDragging) {
        const newGroupPos = new Vector3(
          intersect.point.x,
          0,
          intersect.point.z,
        );
        refGroup.current.position.lerp(newGroupPos, 0.1);
        ref.current.position.y = MathUtils.lerp(
          ref.current.position.y,
          PERSON_HEIGHT * 0.15,
          0.2,
        );
      }
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
    console.log('clicked');
    if (!isDragging) {
      setIsDragging(true);
      setDraggingRef(refGroup.current);
      if (refGroup.current) {
        setDraggingId(uuid);
        beforeDragPosition.current.copy(refGroup.current.position);
      }
    } else {
      setIsDragging(false);
      setDraggingId(null);
    }
  };

  return (
    <PersonMachineProvider value={service}>
      <>
        <group ref={refGroup}>
          <mesh ref={ref} uuid={uuid} onClick={handleOnClick}>
            <planeBufferGeometry args={[3, PERSON_HEIGHT]} />
            <meshBasicMaterial map={tex} transparent alphaTest={0.1} />
          </mesh>
          <Statbar />

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
          {showActionButtons && (
            <Html>
              <button
                style={{ position: 'absolute', right: -100, top: 0 }}
                type={'button'}
                onClick={() => service.send({ type: 'onDrag' })}
              >
                On Drag
              </button>
              <button
                style={{ position: 'absolute', right: -100, top: 20 }}
                type={'button'}
                onClick={() =>
                  service.send({ type: 'onDrop', action: 'drink' })
                }
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
    </PersonMachineProvider>
  );
};
