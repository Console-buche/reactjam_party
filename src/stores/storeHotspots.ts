// Use this store to get 3D positions and UI related stuff

export const hotspots = [
  'Lobby',
  'Couch',
  'Dancefloor',
  'Bar',
  'Dining_table',
  'Green Armchair',
  'Blue Armchair',
  'Toilets',
] as const;

import { Vector3 } from 'three';
import { create } from 'zustand';

type Hotspots = Record<(typeof hotspots)[number], { position: Vector3 }>;

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
    Lobby: {
      position: new Vector3(0, 0, 0),
    },
    'Blue Armchair': {
      position: new Vector3(0, 0, 0),
    },
    'Green Armchair': {
      position: new Vector3(0, 0, 0),
    },
    Bar: {
      position: new Vector3(0, 0, 0),
    },
    Couch: {
      position: new Vector3(0, 0, 0),
    },
    Dancefloor: {
      position: new Vector3(0, 0, 0),
    },
    Dining_table: {
      position: new Vector3(0, 0, 0),
    },
    Toilets: {
      position: new Vector3(0, 0, 0),
    },
  },
  names: [
    'Lobby',
    'Couch',
    'Dancefloor',
    'Bar',
    'Dining_table',
    'Green Armchair',
    'Blue Armchair',
    'Toilets',
  ],
};

export const useStoreDragging = create<InitialState & Actions>((set) => ({
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
