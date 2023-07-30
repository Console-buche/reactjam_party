import type { BufferGeometry, MeshStandardMaterial } from 'three';
import type {} from 'xstate';
import type { hotspots } from '../../../../stores/storeHotspots';

export type AppartmentHotSpot = {
  geometry: BufferGeometry;
  materials: MeshStandardMaterial;
  type: (typeof hotspots)[number];
  stats: ({
    maxPersonsCount,
    personsCount,
  }: {
    personsCount: number;
    maxPersonsCount: number;
  }) => React.ReactNode;
};
