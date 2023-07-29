import { hotspotMachine } from './hotspot.machine';

export const sofaMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 6,
    name: 'sofa',
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        console.log(
          'sofa.updatePersons - updating persons by sending triggerSeat',
          context.persons,
        );
        context.persons.forEach((p) => p.send('triggerSeat'));
        return context;
      },
    },
  });
