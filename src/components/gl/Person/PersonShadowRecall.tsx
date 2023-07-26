import { a, useSpring } from '@react-spring/three';
import { useEffect, useRef } from 'react';
import { Mesh, Vector3 } from 'three';

export const PersonShadowRecall = ({
  isBeingDragged,
  beforeDragPosition,
}: {
  isBeingDragged: boolean;
  beforeDragPosition: Vector3;
}) => {
  const refShadowRecall = useRef<Mesh>(null);

  // setup easings
  const shadow = useSpring({
    opacity: isBeingDragged ? 0.9 : 0,
    color: isBeingDragged ? '#FFA500' : 'grey',
    scale: isBeingDragged
      ? ([1.25, 1.25, 1.25] as const)
      : ([0.75, 0.75, 0.75] as const),
  });

  useEffect(() => {
    if (refShadowRecall.current) {
      refShadowRecall.current.position.set(
        beforeDragPosition.x,
        -1.5,
        beforeDragPosition.z,
      );
    }
  }, [beforeDragPosition, isBeingDragged]);

  return (
    <a.mesh
      ref={refShadowRecall}
      rotation-x={Math.PI * -0.5}
      scale={shadow.scale}
    >
      <ringBufferGeometry />
      {/* @ts-ignore */}
      <a.meshLambertMaterial
        transparent
        opacity={shadow.opacity}
        depthWrite={false}
        color={shadow.color}
        toneMapped={false}
        emissive={0xffffff}
        emissiveIntensity={1.2}
      />
    </a.mesh>
  );
};
