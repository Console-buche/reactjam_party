import { hotspotMachine } from './hotspot.machine';

export const toiletMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 1,
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        context.persons.forEach((p) => p.send('triggerPee'));
        return context;
      },
    },
  });
