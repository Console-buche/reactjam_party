import { Vector3 } from 'three';
import { hotspotMachine } from './hotspot.machine';

export const dancefloorMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 4,
    name: 'dancefloor',
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
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        // console.log('dancefloor.updatePersons', context.persons);
        context.persons.forEach((p) => p.send('onDancefloor'));
        return context;
      },
    },
  });
