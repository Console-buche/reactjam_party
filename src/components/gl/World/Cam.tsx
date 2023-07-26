import { CameraControls } from '@react-three/drei';
import { useControls } from 'leva';
import { useEffect, useRef } from 'react';
import { Box3, Vector3 } from 'three';
import { DEG2RAD } from 'three/src/math/MathUtils';

export const Cam = () => {
  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    cameraControlsRef.current?.setBoundary(
      new Box3(new Vector3(-26, 2, 0), new Vector3(55.5, 2, 0)),
    );
  }, [cameraControlsRef]);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        maxDistance={23}
        distance={23}
        truckSpeed={4}
        polarAngle={DEG2RAD * 87}
        minPolarAngle={DEG2RAD * 87}
        maxPolarAngle={DEG2RAD * 87}
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
