import { hotspotMachine } from './hotspot.machine';

export const toiletMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 3,
    name: 'toilet',
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        context.persons.forEach((p) => p.send('triggerPee'));
        return context;
      },
    },
  });
