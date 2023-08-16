import { Vector3 } from 'three';
import { hotspotMachine } from './hotspot.machine';

export const buffetMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 5,
    name: 'buffet',
    dropzones: [
      {
        position: new Vector3(22, -1.8, 9),
        personActorId: null,
        index: 0,
        hotspotType: 'buffet',
      },
      {
        position: new Vector3(27, -1.8, 10),
        personActorId: null,
        index: 1,
        hotspotType: 'buffet',
      },
      {
        position: new Vector3(31, -1.8, 10),
        personActorId: null,
        index: 2,
        hotspotType: 'buffet',
      },
      {
        position: new Vector3(38, -1.8, 7),
        personActorId: null,
        index: 3,
        hotspotType: 'buffet',
      },
      {
        position: new Vector3(26, -1.8, 4),
        personActorId: null,
        index: 4,
        hotspotType: 'buffet',
      },
    ],
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        // console.log('buffet.updatePersonst', context.persons);
        context.persons.forEach((p) => p.send('onBuffet'));
        return context;
      },
    },
  });
