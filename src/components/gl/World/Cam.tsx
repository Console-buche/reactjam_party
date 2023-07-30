import { CameraControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Box3, Vector3 } from 'three';
import { DEG2RAD } from 'three/src/math/MathUtils';
import { useStoreCam } from '../../../stores/storeCam';
import { useStoreHotspot } from '../../../stores/storeHotspots';

export const Cam = () => {
  const hotspotWithPositions = useStoreHotspot((state) => state.hotspots);
  const cameraControlsRef = useRef<CameraControls>(null);
  const registerControls = useStoreCam((state) => state.registerControls);

  // register controls
  useEffect(() => {
    if (cameraControlsRef.current) {
      registerControls(cameraControlsRef.current);
    }
  }, [cameraControlsRef, registerControls]);

  useEffect(() => {
    cameraControlsRef.current?.setBoundary(
      new Box3(new Vector3(-26, 2, 0), new Vector3(60, 2, 0)),
    );

    const pos = hotspotWithPositions.lobby.position.clone();
    cameraControlsRef.current?.setLookAt(
      ...new Vector3(pos.x, 4, 23).toArray(),
      ...pos
        .clone()
        .add(new Vector3(0, 2, -1))
        .toArray(),
      true,
    );
  }, [cameraControlsRef]);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        maxDistance={26}
        distance={26}
        truckSpeed={4}
        polarAngle={DEG2RAD * 83}
        minPolarAngle={DEG2RAD * 83}
        maxPolarAngle={DEG2RAD * 83}
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
