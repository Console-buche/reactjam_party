import { CameraControls } from '@react-three/drei';
import { useRef, useState } from 'react';
import { DEG2RAD } from 'three/src/math/MathUtils';
import { RoomBounds } from './RoomBounds';

export const Cam = ({ isDragging }: { isDragging: boolean }) => {
  const cameraControlsRef = useRef<CameraControls>(null);
  const [isRoomBoundMode, setIsRoomBoundMode] = useState(false);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        enabled={!isDragging && !isRoomBoundMode}
        maxDistance={55}
        distance={55}
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
      <RoomBounds onClick={setIsRoomBoundMode} />
    </>
  );
};
