import { hotspotMachine } from './hotspot.machine';

export const sofaMachine = hotspotMachine
  .withContext({
    ...hotspotMachine.context,
    maxPersons: 4,
    name: 'sofa',
  })
  .withConfig({
    actions: {
      updatePersons: (context) => {
        console.log('sofa.updatePersons', context.persons);
        context.persons.forEach((p) => p.send('onSofa'));
        return context;
      },
    },
  });
