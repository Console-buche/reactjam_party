import { CameraControls } from '@react-three/drei';
import { useRef } from 'react';
import { DEG2RAD } from 'three/src/math/MathUtils';

export const Cam = ({ isDragging }: { isDragging: boolean }) => {
  const cameraControlsRef = useRef<CameraControls>(null);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        enabled={!isDragging}
        maxDistance={30}
        distance={30}
        polarAngle={DEG2RAD * 55}
        minPolarAngle={DEG2RAD * 55}
        maxPolarAngle={DEG2RAD * 55}
        mouseButtons={{
          left: 1,
          wheel: 0,
          middle: 0,
          right: 0,
        }}
      />
    </>
  );
};
