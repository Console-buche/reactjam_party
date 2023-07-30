import { hotspotMachine } from './hotspot.machine';

export const dancefloorMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 4,
    name: 'dancefloor',
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
