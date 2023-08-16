import { Vector3 } from 'three';
import { hotspotMachine } from './hotspot.machine';

export const barMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 5,
    name: 'bar',
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
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        // console.log('bar.updatePersons', context.persons);
        context.persons.forEach((p) => p.send('onBar'));
        return context;
      },
    },
  });
