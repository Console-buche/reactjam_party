import { ActorRefFrom, assign, createMachine } from 'xstate';
import { personMachine } from './person.machine';

export const hotspotMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAkD2AXWAHDBiVAdgIIQQAKYATrIQNoAMAuoqDrAJbruEsgAeiALQAmAIwBWAHTCAHKOHiAzPRnCAbAHYtwgDQgAnolH0NkgJz01wsQBZFcs2dkBfZ3rSYc6fAQBKYAFtUADcwCmo6Jl42Tm4CXgEERXFhSWVxDUUNYXphDRszGQ09QwQNNTSzcTV6Gy1jezNXdwxsPEIAVSwIAEN0MKoaAgZmJBAYrh4xxNEbGXMxItFM4SdakqE1cWaQDzb0SS7ergIocKHYXD5YdD6wSR6AM37KAApjenoASlw9r0Pun12KdzoRYCNoqgOJN4tMjKpzCk5EplA1rBsEDZcpINDJFPIPmo7AVtjsCKgIHBeH8MJDoXEEogsZI1MtRGotvRCuJRHIMQpRNI8fINJZHLM1DsaQcjkCQYMwXTYlNQIkZPNWRp2ZzubzRBilBV8cI5iozKJ5IobK5XEA */
    id: 'Hotspot',
    description:
      'A hotspot is a point of interest where you can drop a person to interact with the environment.',
    context: {
      maxPersons: 3,
      persons: [],
    },
    initial: 'UpdatingPersons',
    states: {
      UpdatingPersons: {
        after: {
          '1000': [
            {
              actions: 'updatePersons',
              target: 'UpdatingPersons',
            },
          ],
        },
      },
    },
    on: {
      onAddPerson: {
        actions: ['addPerson'],
        cond: 'canAddPerson',
      },
      onRemovePerson: {
        actions: ['removePerson'],
        cond: 'canRemovePerson',
      },
    },
    schema: {
      context: {} as {
        persons: ActorRefFrom<typeof personMachine>[];
        maxPersons: number;
      },
      events: {} as
        | { type: 'onAddPerson'; person: ActorRefFrom<typeof personMachine> }
        | { type: 'onRemovePerson'; id: string }
        | { type: 'onUpdatePerson' },

      actions: {} as
        | { type: 'updatePersons' }
        | { type: 'addPerson' }
        | { type: 'removePerson' },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./hotspot.machine.typegen').Typegen0,
  },
  {
    actions: {
      addPerson: assign((context, event) => {
        return {
          ...context,
          persons: [...context.persons, event.person],
        };
      }),
      removePerson: assign((context, event) => {
        return {
          ...context,
          persons: context.persons.filter((machine) => machine.id !== event.id),
        };
      }),
    },
    guards: {
      canAddPerson: (context) => context.persons.length < context.maxPersons,
      canRemovePerson: (context) => context.persons.length > 0,
    },
  },
);
