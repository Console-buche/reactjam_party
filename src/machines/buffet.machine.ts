import { hotspotMachine } from './hotspot.machine';

export const buffet = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 6,
    name: 'buffet',
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        console.log(
          'buffet.updatePersons - updating persons by sending triggerEat',
          context.persons,
        );
        context.persons.forEach((p) => p.send('triggerEat'));
        return context;
      },
    },
  });
