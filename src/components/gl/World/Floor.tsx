import { forwardRef } from "react";
import { Mesh } from "three";

type Floor = {
  setDrag: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Floor = forwardRef<Mesh, Floor>(({ setDrag }, ref) => (
  // todo : use ref in machine instead
  <mesh
    ref={ref}
    position-y={-1}
    rotation-x={Math.PI * -0.5}
    onClick={() => setDrag(false)}
  >
    <planeBufferGeometry args={[100, 100]} />
    <meshBasicMaterial />
  </mesh>
));
