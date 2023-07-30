import { hotspotMachine } from './hotspot.machine';

export const buffetMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 5,
    name: 'buffet',
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
