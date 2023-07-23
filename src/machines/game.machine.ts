import { ActorRefFrom, assign, createMachine, spawn } from 'xstate';
import { personMachine } from './person.machine';

export const gameMachine = createMachine(
  {
    id: 'Game',
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
    description: 'Game machine',

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
  }
);
