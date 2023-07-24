import { hotspotMachine } from './hotspot.machine';

export const barMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 6,
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        console.log(context.persons);
        context.persons.forEach((p) => p.send('triggerDrink'));
        return context;
      },
    },
  });
