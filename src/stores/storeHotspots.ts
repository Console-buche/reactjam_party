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
import type { HotSpots } from '../machines/game.machine';

type Dropzone = {
  position: Vector3;
  index: number;
  personActorId: string | null;
  hotspotType: (typeof hotspots)[number];
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
  clearHotSpotsDropZonesForActor: (actorRefId: string) => void;
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
          position: new Vector3(-19, -1.8, 6.8),
          personActorId: null,
          index: 0,
          hotspotType: 'lobby',
        },
        {
          position: new Vector3(-16, -1.8, 7),
          personActorId: null,
          index: 1,
          hotspotType: 'lobby',
        },
        {
          position: new Vector3(-13, -1.8, 2.5),
          personActorId: null,
          index: 2,
          hotspotType: 'lobby',
        },
        {
          position: new Vector3(-11, -1.8, 4.5),
          personActorId: null,
          index: 3,
          hotspotType: 'lobby',
        },
      ],
    },
    bar: {
      position: new Vector3(10, 0, 0),
      dropzones: [
        {
          position: new Vector3(4.2, -1.8, 3.8),
          personActorId: null,
          index: 0,
          hotspotType: 'bar',
        },
        {
          position: new Vector3(4.2, -1.8, 6.5),
          personActorId: null,
          index: 1,
          hotspotType: 'bar',
        },
        {
          position: new Vector3(6.9, -1.8, 8.6),
          personActorId: null,
          index: 2,
          hotspotType: 'bar',
        },
        {
          position: new Vector3(4.7, -1.8, 8.6),
          personActorId: null,
          index: 3,
          hotspotType: 'bar',
        },
        {
          position: new Vector3(10, -1.8, 10.2),
          personActorId: null,
          index: 4,
          hotspotType: 'bar',
        },
      ],
    },
    sofa: {
      position: new Vector3(-15, 0, 0),
      dropzones: [
        {
          position: new Vector3(-13, -1.8, 7.9),
          personActorId: null,
          index: 0,
          hotspotType: 'sofa',
        },
        {
          position: new Vector3(-18, -1.8, 6.7),
          personActorId: null,
          index: 1,
          hotspotType: 'sofa',
        },
        {
          position: new Vector3(-11, -1.8, 5.1),
          personActorId: null,
          index: 2,
          hotspotType: 'sofa',
        },
        {
          position: new Vector3(-13, -1.8, 0.8),
          personActorId: null,
          index: 3,
          hotspotType: 'sofa',
        },
      ],
    },
    dancefloor: {
      position: new Vector3(-2, 0, 0),
      dropzones: [
        {
          position: new Vector3(-7, -1.8, 4.5),
          personActorId: null,
          index: 0,
          hotspotType: 'dancefloor',
        },
        {
          position: new Vector3(-4.9, -1.8, 6.5),
          personActorId: null,
          index: 1,
          hotspotType: 'dancefloor',
        },
        {
          position: new Vector3(-2.8, -1.8, 4.9),
          personActorId: null,
          index: 2,
          hotspotType: 'dancefloor',
        },
        {
          position: new Vector3(0, -1.8, 4.6),
          personActorId: null,
          index: 3,
          hotspotType: 'dancefloor',
        },
      ],
    },
    buffet: {
      position: new Vector3(30, 0, 0),
      dropzones: [
        {
          position: new Vector3(22, -1.8, 4),
          personActorId: null,
          index: 0,
          hotspotType: 'buffet',
        },
        {
          position: new Vector3(27, -1.8, 7),
          personActorId: null,
          index: 1,
          hotspotType: 'buffet',
        },
        {
          position: new Vector3(31, -1.8, 1),
          personActorId: null,
          index: 2,
          hotspotType: 'buffet',
        },
        {
          position: new Vector3(38, -1.8, 5),
          personActorId: null,
          index: 3,
          hotspotType: 'buffet',
        },
        {
          position: new Vector3(26, -1.8, 0.4),
          personActorId: null,
          index: 4,
          hotspotType: 'buffet',
        },
      ],
    },
    toilet: {
      position: new Vector3(55, 0, 0),
      dropzones: [
        {
          position: new Vector3(55, -1.8, 0),
          personActorId: null,
          index: 0,
          hotspotType: 'toilet',
        },
        {
          position: new Vector3(55, -1.8, 2.7),
          personActorId: null,
          index: 1,
          hotspotType: 'toilet',
        },
        {
          position: new Vector3(58, -1.8, 5.3),
          personActorId: null,
          index: 2,
          hotspotType: 'toilet',
        },
      ],
    },
  },
  names: ['lobby', 'sofa', 'dancefloor', 'bar', 'buffet', 'toilet'],
};

export const useStoreHotspot = create<InitialState & Actions>((set, get) => ({
  ...InitialState,

  getAvailableDropZone(hotspot) {
    console.log(hotspot);
    console.log(get().hotspots[hotspot].dropzones);
    return get().hotspots[hotspot].dropzones.find(
      (d) => d.personActorId === null,
    );
  },

  clearHotSpotsDropZonesForActor(actorRefId) {
    set((state) => {
      const hotspots = { ...state.hotspots };
      Object.keys(hotspots).forEach((hotspotKey) => {
        const key = hotspotKey as keyof Hotspots;
        const dropzones = [...hotspots[key].dropzones];
        const dropzone = dropzones.find((d) => d.personActorId === actorRefId);
        if (dropzone) {
          dropzone.personActorId = null;
        }
        hotspots[key].dropzones = dropzones;
      });
      return {
        hotspots,
      };
    });
  },

  updateDropZoneOccupied(hotspotType, index, actorRefId) {
    return set((state) => {
      const dropzones = [...state.hotspots[hotspotType].dropzones];
      // find actorRefId in dropzones and remove of it if it exists

      const alreadyOccupiedByActor = dropzones.find(
        (d) => d.personActorId === actorRefId,
      );
      if (alreadyOccupiedByActor) {
        alreadyOccupiedByActor.personActorId = null;
      }

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
