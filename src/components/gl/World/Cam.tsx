import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { useRef, useState } from 'react';
import { Vector3, PerspectiveCamera as CamType } from 'three';
import { RoomBounds } from './RoomBounds';
import { useFrame } from '@react-three/fiber';
import { DEG2RAD } from 'three/src/math/MathUtils';

interface MousePosition {
  x: number;
  y: number;
}

// TODO: get bounds for each Target zone
// TODO : get the target zone from the camera icons that can be clicked over each room
function calculateVectorFromMousePosition(
  mouse: MousePosition,
  camPosition: Vector3,
  factor = 2,
  maxDistance = 30,
  triggerBorderWidth = 0.5,
): Vector3 {
  let x = 0,
    z = 0;

  if (mouse.x > triggerBorderWidth) {
    if (camPosition.x < maxDistance * 0.15) {
      x = 0.1;
    }
  } else if (mouse.x < -triggerBorderWidth) {
    if (camPosition.x > -maxDistance * 0.15) {
      x = -0.1;
    }
  }

  if (mouse.y > triggerBorderWidth) {
    if (camPosition.z > maxDistance * 0.5) {
      z = 0.1;
    }
  } else if (mouse.y < -triggerBorderWidth) {
    if (camPosition.z < maxDistance) {
      z = -0.1;
    }
  }

  return new Vector3(x, 0, z).multiplyScalar(factor);
}

interface MousePosition {
  x: number;
  y: number;
}

export const Cam = ({ isDragging }: { isDragging: boolean }) => {
  const cameraControlsRef = useRef<CameraControls>(null);
  const [isRoomBoundMode, setIsRoomBoundMode] = useState(false);
  const refCam = useRef<CamType>(null);

  useFrame(({ mouse }) => {
    if (!cameraControlsRef.current || isRoomBoundMode) return;

    const vector = calculateVectorFromMousePosition(
      mouse,
      cameraControlsRef.current.getPosition(new Vector3()),
      5,
      60,
      0.85,
    );

    if (vector.x !== 0) {
      cameraControlsRef.current.truck(vector.x, 0, true);
    }
    if (vector.z !== 0) {
      cameraControlsRef.current.forward(vector.z, true);
    }

    // cameraControlsRef.current.setTarget(0, 0, 0, true);
  });

  // useFrame(({ mouse }) => {
  //   if (!refCam.current || isRoomBoundMode) return;

  //   refCam.current.lookAt(0, 0, 0);
  // });

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        enabled={!isDragging && !isRoomBoundMode}
        maxDistance={40}
        distance={40}
        polarAngle={DEG2RAD * 50}
        mouseButtons={{
          left: 0,
          wheel: 0,
          middle: 0,
          right: 0,
        }}
      />
      {/* <PerspectiveCamera ref={refCam} makeDefault position={[0, 25, 20]} /> */}
      <RoomBounds onClick={setIsRoomBoundMode} />
    </>
  );
};
