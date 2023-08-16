// Use this store to get 3D positions and UI related stuff

export const hotspots = [
  'lobby',
  'sofa',
  'dancefloor',
  'bar',
  'buffet',
  'toilet',
] as const;

import { Vector3 } from 'three';
import { create } from 'zustand';

type HotSpotWithDropSpots = {
  position: Vector3;
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
    },
    bar: {
      position: new Vector3(10, 0, 0),
    },
    sofa: {
      position: new Vector3(-15, 0, 0),
    },
    dancefloor: {
      position: new Vector3(-2, 0, 0),
    },
    buffet: {
      position: new Vector3(30, 0, 0),
    },
    toilet: {
      position: new Vector3(50, 0, 0),
    },
  },
  names: ['lobby', 'sofa', 'dancefloor', 'bar', 'buffet', 'toilet'],
};

export const useStoreHotspot = create<InitialState & Actions>((set) => ({
  ...InitialState,

  updateHotSpotPosition(hotspot, position) {
    set((state) => ({
      hotspots: {
        ...state.hotspots,
        [hotspot]: {
          ...state.hotspots[hotspot],
          position,
        },
      },
    }));
  },
}));
