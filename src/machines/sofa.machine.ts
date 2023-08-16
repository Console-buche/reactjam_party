import { Vector3 } from 'three';
import { hotspotMachine } from './hotspot.machine';

export const sofaMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 4,
    name: 'sofa',
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
        position: new Vector3(-16, -1.8, 0.8),
        personActorId: null,
        index: 3,
        hotspotType: 'sofa',
      },
    ],
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        // console.log('sofa.updatePersons', context.persons);
        context.persons.forEach((p) => p.send('onSofa'));
        return context;
      },
    },
  });
