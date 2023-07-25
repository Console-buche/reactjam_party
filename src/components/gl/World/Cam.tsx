import { CameraControls } from '@react-three/drei';
import { useRef } from 'react';
import { DEG2RAD } from 'three/src/math/MathUtils';
import { useStoreDragging } from '../../../stores/storeDragging';

export const Cam = () => {
  const isDragging = useStoreDragging((state) => state.isDragging);
  const cameraControlsRef = useRef<CameraControls>(null);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        enabled={!isDragging}
        maxDistance={22}
        distance={22}
        truckSpeed={4}
        polarAngle={DEG2RAD * 80}
        minPolarAngle={DEG2RAD * 80}
        maxPolarAngle={DEG2RAD * 80}
        mouseButtons={{
          left: 2,
          wheel: 0,
          middle: 0,
          right: 0,
        }}
      />
    </>
  );
};
