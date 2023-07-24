import { ActorRefFrom, assign, createMachine, spawn } from 'xstate';
import { personMachine } from './person.machine';

export const gameMachine = createMachine(
  {
    id: 'Game',
    description:
      'The game machine is the root machine of the game, it handles the game state.',
    context: {
      persons: [],
    },
    on: {
      onAddPerson: {
        actions: ['addPerson'],
      },
      onRemovePerson: {
        actions: ['removePerson'],
      },
    },

    schema: {
      context: {} as {
        persons: ActorRefFrom<typeof personMachine>[];
      },
      events: {} as
        | { type: 'onAddPerson' }
        | { type: 'onRemovePerson'; id: string },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./game.machine.typegen').Typegen0,
  },
  {
    actions: {
      addPerson: assign((context) => {
        return {
          ...context,
          persons: [
            ...context.persons,
            spawn(personMachine, context.persons.length.toString()),
          ],
        };
      }),
      removePerson: assign((context, event) => {
        return {
          ...context,
          persons: [
            ...context.persons.filter((machine) => machine.id !== event.id),
          ],
        };
      }),
    },
    services: {},
    delays: {},
  },
);
