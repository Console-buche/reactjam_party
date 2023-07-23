import { hotspotMachine } from './hotspot.machine';

export const barMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 6,
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        context.persons.forEach((p) => p.send('triggerDrink'));
        return context;
      },
    },
  });
