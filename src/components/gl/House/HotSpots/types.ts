import type { BufferGeometry, MeshStandardMaterial } from 'three';
import type {} from 'xstate';
import type { HotSpots } from '../../../../machines/game.machine';

export type AppartmentHotSpot = {
  geometry: BufferGeometry;
  materials: MeshStandardMaterial;
  type: keyof HotSpots;
};
