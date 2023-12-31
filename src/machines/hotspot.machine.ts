import { type ActorRefFrom, assign, createMachine, sendParent } from 'xstate';
import { personMachine } from './person.machine';
import type { Vector3 } from 'three';

export const hotspotMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAkD2AXWAHDBiVAdgIIQQAKYATrIQNoAMAuoqDrAJbruEsgAeiALQAmAIwBWAHTCAHKOHiAzPRnCAbAHYtwgDQgAnolH0NkgJz01wsQBZFcs2dkBfZ3rSYc6fAQBKYAFtUADcwCmo6Jl42Tm4CXgEERXFhSWVxDUUNYXphDRszGQ09QwQNNTSzcTV6Gy1jezNXdwxsPEIAVSwIAEN0MKoaAgZmJBAYrh4xxNEbGXMxItFM4SdakqE1cWaQDzb0SS7ergIocKHYXD5YdD6wSR6AM37KAApjenoASlw9r0Pun12KdzoRYCNoqgOJN4tMjKpzCk5EplA1rBsEDZcpINDJFPIPmo7AVtjsCKgIHBeH8MJDoXEEogsZI1MtRGotvRCuJRHIMQpRNI8fINJZHLM1DsaQcjkCQYMwXTYlNQIkZPNWRp2ZzubzRBilBV8cI5iozKJ5IobK5XEA */
  id: 'Hotspot',
  description:
    'A hotspot is a point of interest where you can drop a person to interact with the it.',
  context: {
    maxPersons: 3,
    persons: [],
    name: 'GenericHotspot',
    dropzones: [],
  },
  initial: 'Ticking',
  states: {
    Inactive: {
      on: {
        triggerStart: 'Ticking',
      },
    },
    Ticking: {
      on: {
        triggerPause: 'Inactive',
      },
      entry: [
        'updatePersons',
        sendParent((context) => ({
          type: 'onIncrementHype',
          hype: context.persons.length < 1 ? 0 : context.persons.length * 5,
        })),
      ],
      after: {
        '500': 'Ticking',
      },
    },
  },
  on: {
    onRegisterPerson: {
      actions: assign((context, event) => {
        // console.log(
        //   'hotspot.onRegisterPerson - adding the person to the hotspot context',
        // );
        if (context.persons.find((e) => e.id === event.person.id)) {
          return context;
        }

        const availableDropzone = context.dropzones.find(
          (dz) => dz.personActorId === null,
        );

        return {
          ...context,
          dropzones: context.dropzones.map((dz) => {
            if (dz.index === availableDropzone?.index) {
              return {
                ...dz,
                personActorId: event.person.id,
              };
            }
            return dz;
          }),
          persons: [...context.persons, event.person],
        };
      }),
      // actions: 'test',
    },
    onUnregisterPerson: {
      actions: assign((context, event) => {
        // console.log(
        //   'hotspot.onUnregisterPerson - removing the person to the hotspot context',
        // );

        const occupiedDropzone = context.dropzones.find(
          (dz) => dz.personActorId === event.person.id,
        );

        return {
          ...context,
          dropzones: context.dropzones.map((dz) => {
            if (dz.index === occupiedDropzone?.index) {
              return {
                ...dz,
                personActorId: null,
              };
            }
            return dz;
          }),
          persons: context.persons.filter((p) => p.id !== event.person.id),
        };
      }),
    },
  },
  schema: {
    context: {} as {
      persons: ActorRefFrom<typeof personMachine>[];
      maxPersons: number;
      name: string;
      dropzones: Array<{
        position: Vector3;
        personActorId: string | null;
        index: number;
        hotspotType:
          | 'lobby'
          | 'bar'
          | 'dancefloor'
          | 'toilet'
          | 'sofa'
          | 'buffet';
      }>;
    },
    events: {} as
      | { type: 'triggerStart' }
      | { type: 'triggerPause' }
      | { type: 'onUpdatePerson' }
      | {
          type: 'onRegisterPerson';
          person: ActorRefFrom<typeof personMachine>;
        }
      | {
          type: 'onUnregisterPerson';
          person: ActorRefFrom<typeof personMachine>;
        },
    actions: {} as { type: 'updatePersons' } | { type: 'updateHype' },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
  tsTypes: {} as import('./hotspot.machine.typegen').Typegen0,
});
