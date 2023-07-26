import type { BufferGeometry, MeshStandardMaterial } from 'three';
import type {} from 'xstate';
import type { toiletMachine } from '../../../../machines/toilet.machine';
import type { barMachine } from '../../../../machines/bar.machine';

export type AppartmentHotSpot = {
  geometry: BufferGeometry;
  materials: MeshStandardMaterial;
  hotSpotMachine: typeof barMachine | typeof toiletMachine;
};
