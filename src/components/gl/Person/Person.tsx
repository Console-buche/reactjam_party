import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useId, useRef } from "react";
import { BufferGeometry, Material, Mesh, Vector3 } from "three";

const PERSON_HEIGHT = 4;

export const Person = ({
  refFloor,
  setDrag,
  drag,
}: {
  refFloor: React.RefObject<Mesh<BufferGeometry, Material | Material[]>>;
  setDrag: React.Dispatch<React.SetStateAction<boolean>>;
  drag: boolean;
}) => {
  const ref = useRef<Mesh>(null);
  const tex = useTexture("assets/dudess.png");
  const uuid = useId();

  useEffect(() => {
    if (ref.current) {
      ref.current.geometry.translate(0, PERSON_HEIGHT * 0.5, 0);
    }
  }, []);

  useFrame(({ raycaster, camera, clock }) => {
    if (!ref.current || !refFloor) {
      return;
    }

    const intersects =
      refFloor.current && raycaster.intersectObject(refFloor.current);

    if (intersects && intersects.length > 0) {
      const [intersect] = intersects;
      if (drag) {
        const newPos = new Vector3(
          intersect.point.x,
          PERSON_HEIGHT * -0.25,
          intersect.point.z
        );
        ref.current.position.lerp(newPos, 0.1);
      }
      ref.current.lookAt(new Vector3(camera.position.x, 0, camera.position.z));
      ref.current.scale.y = Math.sin(clock.getElapsedTime() * 10) * 0.05 + 1;
    }
  });

  return (
    <mesh
      ref={ref}
      uuid={uuid}
      onClick={() => setDrag(true)}
      scale={drag ? [1, 1.2, 1] : 1}
    >
      <planeBufferGeometry attach="geometry" args={[2, PERSON_HEIGHT]} />
      <meshBasicMaterial map={tex} transparent alphaTest={0.1} />
    </mesh>
  );
};
