import { hotspotMachine } from './hotspot.machine';

export const dancefloorMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 6,
    name: 'dancefloor',
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        console.log(
          'dancefloor.updatePersons - updating persons by sending triggerDance',
          context.persons,
        );
        context.persons.forEach((p) => p.send('triggerDance'));
        return context;
      },
    },
  });
