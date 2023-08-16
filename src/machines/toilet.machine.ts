import { Vector3 } from 'three';
import { hotspotMachine } from './hotspot.machine';

export const toiletMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 1,
    name: 'toilet',
    dropzones: [
      {
        position: new Vector3(55, -1.8, 2.7),
        personActorId: null,
        index: 0,
        hotspotType: 'toilet',
      },
    ],
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        // console.log('toilet.updatePersons', context.persons);
        context.persons.forEach((p) => p.send('onToilet'));
        return context;
      },
    },
  });
