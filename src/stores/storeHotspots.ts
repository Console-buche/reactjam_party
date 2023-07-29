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

type Dropzone = {
  position: Vector3;
  index: number;
  personActorId: string | null;
};

type HotSpotWithDropSpots = {
  position: Vector3;
  dropzones: Dropzone[];
};
type Hotspots = Record<(typeof hotspots)[number], HotSpotWithDropSpots>;

type InitialState = {
  names: typeof hotspots;
  hotspots: Hotspots;
};

type Actions = {
  getAvailableDropZone: (
    hotspot: (typeof hotspots)[number],
  ) => Dropzone | undefined;
  updateDropZoneOccupied: (
    hotspot: (typeof hotspots)[number],
    index: number,
    actorRefId: string | null, // on null, empty
  ) => void;
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
        {
          position: new Vector3(-19, -1, 6.8),
          personActorId: null,
          index: 0,
        },
        {
          position: new Vector3(-16, -1, 7),
          personActorId: null,
          index: 1,
        },
        {
          position: new Vector3(-13, -1, 2.5),
          personActorId: null,
          index: 2,
        },
        {
          position: new Vector3(-11, -1, 4.5),
          personActorId: null,
          index: 3,
        },
      ],
    },
    bar: {
      position: new Vector3(10, 0, 0),
      dropzones: [
        {
          position: new Vector3(4.2, -1, 3.8),
          personActorId: null,
          index: 0,
        },
        {
          position: new Vector3(4.2, -1, 6.5),
          personActorId: null,
          index: 1,
        },
        {
          position: new Vector3(6.9, -1, 8.6),
          personActorId: null,
          index: 2,
        },
        {
          position: new Vector3(4.7, -1, 8.6),
          personActorId: null,
          index: 3,
        },
        {
          position: new Vector3(10, -1, 10.2),
          personActorId: null,
          index: 4,
        },
      ],
    },
    sofa: {
      position: new Vector3(-15, 0, 0),
      dropzones: [
        {
          position: new Vector3(-13, -1, 7.9),
          personActorId: null,
          index: 0,
        },
        {
          position: new Vector3(-18, -1, 6.7),
          personActorId: null,
          index: 1,
        },
        {
          position: new Vector3(-11, -1, 5.1),
          personActorId: null,
          index: 2,
        },
        {
          position: new Vector3(-13, -1, 0.8),
          personActorId: null,
          index: 3,
        },
      ],
    },
    dancefloor: {
      position: new Vector3(-2, 0, 0),
      dropzones: [
        {
          position: new Vector3(-7, -1, 4.5),
          personActorId: null,
          index: 0,
        },
        {
          position: new Vector3(-4.9, -1, 6.5),
          personActorId: null,
          index: 1,
        },
        {
          position: new Vector3(-2.8, -1, 4.9),
          personActorId: null,
          index: 2,
        },
        {
          position: new Vector3(0, -1, 4.6),
          personActorId: null,
          index: 3,
        },
      ],
    },
    buffet: {
      position: new Vector3(30, 0, 0),
      dropzones: [
        {
          position: new Vector3(22, -1, 4),
          personActorId: null,
          index: 0,
        },
        {
          position: new Vector3(27, -1, 7),
          personActorId: null,
          index: 1,
        },
        {
          position: new Vector3(31, -1, 1),
          personActorId: null,
          index: 2,
        },
        {
          position: new Vector3(38, -1, 5),
          personActorId: null,
          index: 3,
        },
        {
          position: new Vector3(26, -1, 0.4),
          personActorId: null,
          index: 4,
        },
      ],
    },
    toilet: {
      position: new Vector3(55, 0, 0),
      dropzones: [
        {
          position: new Vector3(55, -1, 0),
          personActorId: null,
          index: 0,
        },
        {
          position: new Vector3(55, -1, 2.7),
          personActorId: null,
          index: 1,
        },
        {
          position: new Vector3(58, -1, 5.3),
          personActorId: null,
          index: 2,
        },
      ],
    },
  },
  names: ['lobby', 'sofa', 'dancefloor', 'bar', 'buffet', 'toilet'],
};

export const useStoreHotspot = create<InitialState & Actions>((set, get) => ({
  ...InitialState,

  getAvailableDropZone(hotspot) {
    return get().hotspots[hotspot].dropzones.find((d) => !d.personActorId);
  },

  updateDropZoneOccupied(hotspotType, index, actorRefId) {
    return set((state) => {
      const dropzones = [...state.hotspots[hotspotType].dropzones];
      dropzones[index].personActorId = actorRefId;

      return {
        hotspots: {
          ...state.hotspots,
          [hotspotType]: {
            ...state.hotspots[hotspotType],
            dropzones,
          },
        },
      };
    });
  },

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
