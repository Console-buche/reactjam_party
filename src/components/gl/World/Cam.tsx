import { CameraControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Box3, Vector3 } from 'three';
import { DEG2RAD } from 'three/src/math/MathUtils';

export const Cam = () => {
  const cameraControlsRef = useRef<CameraControls>(null);

  // DEBUG
  // const { d, t } = useControls({
  //   d: {
  //     step: 0.1,
  //     value: 22.95,
  //     min: 22,
  //     max: 28,
  //   },
  //   t: {
  //     step: 0.1,
  //     value: 85,
  //     min: 60,
  //     max: 100,
  //   },
  // });

  useEffect(() => {
    cameraControlsRef.current?.setBoundary(
      new Box3(new Vector3(-40, 2, 0), new Vector3(80, 2, 0)),
    );
  }, [cameraControlsRef]);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        // enabled={!isDragging}
        maxDistance={23}
        distance={23}
        truckSpeed={4}
        // truckSpeed={isDragging ? -4 : 4}
        polarAngle={DEG2RAD * 85}
        minPolarAngle={DEG2RAD * 85}
        maxPolarAngle={DEG2RAD * 85}
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
