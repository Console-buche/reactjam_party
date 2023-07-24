import { type ActorRefFrom, assign, createMachine, spawn } from 'xstate';
import { personMachine } from './person.machine';
import { generateUUID } from 'three/src/math/MathUtils';
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
      onRemoveLastPerson: {
        actions: ['removeLastPerson'],
      },
    },
    schema: {
      context: {} as {
        persons: ActorRefFrom<typeof personMachine>[];
      },
      events: {} as
        | { type: 'onAddPerson' }
        | { type: 'onRemovePerson'; id: string }
        | { type: 'onRemoveLastPerson' },
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
          persons: [...context.persons, spawn(personMachine, generateUUID())],
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
      removeLastPerson: assign((context) => {
        return {
          ...context,
          persons: [...context.persons.slice(0, -1)],
        };
      }),
    },
  },
);
