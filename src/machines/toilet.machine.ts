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
        // console.log('toilet.updatePersons', context.persons);
        context.persons.forEach((p) => p.send('onToilet'));
        return context;
      },
    },
  });
