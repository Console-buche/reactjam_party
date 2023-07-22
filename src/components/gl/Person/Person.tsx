import { useSpring, a, easings } from "@react-spring/three";
import { Html, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useContext, useEffect, useId, useRef } from "react";
import {
  BufferGeometry,
  Group,
  Material,
  MathUtils,
  Mesh,
  Vector3,
} from "three";
import { DraggingContext } from "../World/World";
import { Statbar } from "./Statbar";
import { useInterpret } from "@xstate/react";
import { personMachine } from "../../../machines/person.machine";
import { PersonMachineProvider } from "../../../hooks/use";

const PERSON_HEIGHT = 4;

export const Person = ({
  refFloor,
  pos,
}: {
  refFloor: React.RefObject<Mesh<BufferGeometry, Material | Material[]>>;
  pos?: Vector3;
}) => {
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
  const refGroup = useRef<Group>(null);
  const refShadow = useRef<Mesh>(null);
  const tex = useTexture("assets/dudess.png");
  const uuid = useId();

  const isBeingDragged = draggingId === uuid;

  const { spring } = useSpring({
    spring: isBeingDragged,
    config: {
      mass: 1,
      tension: 1000,
      friction: 30,
      easing: easings.easeInCirc,
    },
  });

  // interpolate values from commong spring
  const scale = spring.to([0, 1], [1, 1.1]);
  const opacity = spring.to([0, 1], [0.3, 0.6]);

  useEffect(() => {
    if (ref.current && refGroup.current && !isExists.current) {
      ref.current.geometry.translate(0, PERSON_HEIGHT * 0.5, 0);
      refGroup.current.position.copy(pos || new Vector3(0, 0, 0));
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
          intersect.point.z
        );
        refGroup.current.position.lerp(newGroupPos, 0.1);
        ref.current.position.y = MathUtils.lerp(
          ref.current.position.y,
          PERSON_HEIGHT * 0.15,
          0.2
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
        0.2
      );
    }
  });

  return (
    <PersonMachineProvider value={service}>
      <group ref={refGroup}>
        <mesh
          ref={ref}
          uuid={uuid}
          onPointerDown={() => {
            setIsDragging(true);
            setDraggingRef(refGroup.current);
            ref.current && setDraggingId(uuid);
          }}
          onPointerUp={() => {
            setDraggingId(null);
            setIsDragging(false);
          }}
          scale={isBeingDragged ? [1, 1.2, 1] : 1}
        >
          <planeBufferGeometry args={[2, PERSON_HEIGHT]} />
          <meshBasicMaterial map={tex} transparent alphaTest={0.1} />
        </mesh>
        <Statbar />

        <a.mesh
          ref={refShadow}
          rotation-x={Math.PI * -0.5}
          position-y={-0.9}
          scale={scale}
        >
          <circleBufferGeometry />
          {/* @ts-ignore */}
          <a.meshLambertMaterial
            color="black"
            transparent
            opacity={opacity}
            depthWrite={false}
          />
        </a.mesh>
        <Html>
          <button
            type={"button"}
            onClick={() => service.send({ type: "onDrag" })}
          >
            On Drag
          </button>
          <button
            type={"button"}
            onClick={() => service.send({ type: "onDrop", action: "drink" })}
          >
            Dropped
          </button>
        </Html>
      </group>
    </PersonMachineProvider>
  );
};
