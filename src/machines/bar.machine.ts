import { hotspotMachine } from './hotspot.machine';

export const barMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 6,
    name: 'Bar',
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        console.log(
          'bar.updatePersons - updating persons by sending triggerDrink',
        );
        context.persons.forEach((p) => p.send('triggerDrink'));
        return context;
      },
    },
  });
