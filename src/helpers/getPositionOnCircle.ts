import { Vector3 } from "three";

export function getPositionsOnCircle(
  radius: number,
  elementsCount: number,
  elementId: number,
  offset: number = 0
) {
  const angle = (Math.PI * 2) / elementsCount;
  const x = Math.cos(elementId * angle + offset) * radius;
  const z = Math.sin(elementId * angle + offset) * radius;

  return new Vector3(x, 0, z);
}
