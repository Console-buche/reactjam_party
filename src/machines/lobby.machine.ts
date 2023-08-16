import { Vector3 } from 'three';
import { hotspotMachine } from './hotspot.machine';

export const lobbyMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 3,
    name: 'lobby',
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
    ],
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        return context;
      },
    },
  });
