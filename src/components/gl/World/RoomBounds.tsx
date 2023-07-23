// This component wraps children in a group with a click handler

import { Box } from '@react-three/drei';
import { Suspense } from 'react';

type RoomBounds = {
  onClick: React.Dispatch<React.SetStateAction<boolean>>;
};

// WIP - get clicked ref and pass it as control target to create bounds
export const RoomBounds = ({ onClick }: RoomBounds) => {
  return (
    <Suspense fallback={null}>
      <group>
        {/* TODO: implement clickable cams to navigate to rooms */}
        <Box
          onClick={() => onClick(true)}
          onDoubleClick={() => onClick(false)}
          position={[0, 5, 10]}
        />
        {/* room 1 */}
        <Box
          onClick={() => onClick(true)}
          onDoubleClick={() => onClick(false)}
          position={[0, 5, -10]}
        />
        {/* room 2 */}
        <Box
          onClick={() => onClick(true)}
          onDoubleClick={() => onClick(false)}
          position={[-10, 5, 10]}
        />
        {/* room N... */}
      </group>
    </Suspense>
  );
};
