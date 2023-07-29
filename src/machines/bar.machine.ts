import { hotspotMachine } from './hotspot.machine';

export const barMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 6,
    name: 'bar',
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        console.log('bar.updatePersons', context.persons);
        context.persons.forEach((p) => p.send('onBar'));
        return context;
      },
    },
  });
