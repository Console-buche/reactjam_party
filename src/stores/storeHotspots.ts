// Use this store to get 3D positions and UI related stuff

export const hotspots = [
  'lobby',
  'sofa',
  'dancefloor',
  'bar',
  'table',
  'toilet',
] as const;

import { Vector3 } from 'three';
import { create } from 'zustand';

type HotSpotWithDropSpots = {
  position: Vector3;
  dropzones: Vector3[];
};
type Hotspots = Record<(typeof hotspots)[number], HotSpotWithDropSpots>;

type InitialState = {
  names: typeof hotspots;
  hotspots: Hotspots;
};

type Actions = {
  updateHotSpotPosition: (
    hotspot: (typeof hotspots)[number],
    position: Vector3,
  ) => void;
};

const InitialState: InitialState = {
  hotspots: {
    lobby: {
      position: new Vector3(-30, 0, 0),
      dropzones: [
        new Vector3(-19, -1, 6.8),
        new Vector3(-16, -1, 7),
        new Vector3(-13, -1, 2.5),
        new Vector3(-11, -1, 4.5),
      ],
    },
    bar: {
      position: new Vector3(10, 0, 0),
      dropzones: [
        new Vector3(4.2, -1, 3.8),
        new Vector3(4.2, -1, 6.5),
        new Vector3(6.9, -1, 8.6),
        new Vector3(4.7, -1, 8.6),
        new Vector3(10, -1, 10.2),
      ],
    },
    sofa: {
      position: new Vector3(-15, 0, 0),
      dropzones: [
        new Vector3(-13, -1, 7.9),
        new Vector3(-18, -1, 6.7),
        new Vector3(-11, -1, 5.1),
        new Vector3(-13, -1, 0.8),
      ],
    },
    dancefloor: {
      position: new Vector3(-2, 0, 0),
      dropzones: [
        new Vector3(-7, -1, 4.5),
        new Vector3(-4.9, -1, 6.5),
        new Vector3(-2.8, -1, 4.9),
        new Vector3(0, -1, 4.6),
      ],
    },
    table: {
      position: new Vector3(30, 0, 0),
      dropzones: [
        new Vector3(22, -1, 4),
        new Vector3(27, -1, 7),
        new Vector3(31, -1, 1),
        new Vector3(38, -1, 5),
        new Vector3(26, -1, 0.4),
      ],
    },
    toilet: {
      position: new Vector3(55, 0, 0),
      dropzones: [
        new Vector3(55, -1, 0),
        new Vector3(55, -1, 2.7),
        new Vector3(58, -1, 5.3),
      ],
    },
  },
  names: ['lobby', 'sofa', 'dancefloor', 'bar', 'table', 'toilet'],
};

export const useStoreHotspot = create<InitialState & Actions>((set) => ({
  ...InitialState,

  updateHotSpotPosition(hotspot, position) {
    set((state) => ({
      hotspots: {
        ...state.hotspots,
        [hotspot]: {
          position,
        },
      },
    }));
  },
}));
