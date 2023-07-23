import { OrbitControls } from '@react-three/drei';

export const Cam = ({ isDragging }: { isDragging: boolean }) => {
  if (isDragging) {
    return null;
  }

  return (
    <OrbitControls maxPolarAngle={0.85} minPolarAngle={0.85} minDistance={20} />
  );
};
