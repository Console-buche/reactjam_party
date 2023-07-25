import { type ActorRefFrom, assign, createMachine, spawn, send } from 'xstate';
import { personMachine } from './person.machine';
import { MathUtils } from 'three';

const METERS_CONFIG = {
  clock: {
    initialValue: 0,
    incrementValue: 1,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.clock.maxValue),
  },
};

export const gameMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMBiA9gOwEEIIAFMAJ1nwG0AGAXUVAAcdYBLAF3fyZAA9EAJgBsADgB0tAMwBGIQFZZtcQHYALLNnqANCACeiaQE5VE2UtVjjY9VbHSRAXyd60mXHgBKYdDgBuYGSUNAx8rBzcvEgCwupSIrRCxtIKiUJC0qo2eoYIJmYWstlW0kJiIsbGLm4Y2Pg+foEAMqiwnMFUeHSMMRFcPHh8ggjqxvHaKurSco5jDrmIALTyshJK6mJimWIKe5mqNSDu2Jzk7FAw5CcA8oHkPeFsA9GgI4rxQrJiqgr2qbRVKlFggVgopL8tlUHLRYQpqq5jnUJHgcJwAMqcVDkTiQLBnC5XTHYziPPrPKJDGIjdTgpLyZLGBSw4wiCwiEHMiTqRSVdTTVTJBQ8o4nCTMAA2qH07DwUHx50uFBIqAArrAwGSWBTBsNEOpaBJjLQDXYhLSLTyQUIZOs9hZpICfntpGJRcjJdLZfL+O1ULiJKgAGa48gACmZtAAlFgxZ6ZXKtSB+pS9aDlCIJCJszncznjCDtEIs3nS9n3ZhxWqNRAFYSKMScUmU7rqcJbbQ0vJjcYMmyUtbbXslApHVZfsKXIjURA4HwTk9Iq23ssLPEy6WCwZV9n1pDrDZHbDnIixaiMVicZBFy8qSuEFzNlVsq7HGJOwoQWCIQooYfYZ2FQVmA4pSgmUA3qmbYPoUqgaEC5QGr+qgqIWmTctmZQaLsv4GtIwFVuq17kkuryxDB5hweoIgKIygLmp+24IOUxZCChuwiAanG2OoBFBrK7CwAAFsR2qkXe5HlJmuwpJU2Y2L8JqcoaPJ-EkPIZGIxRCFOThAA */
    id: 'Game',
    description:
      'The game machine is the root machine of the game, it handles the game state.',
    context: {
      persons: [],
      clock: METERS_CONFIG.clock.initialValue,
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
      triggerGameOver: {
        target: 'finished',
      },
    },
    initial: 'notStarted',
    states: {
      notStarted: {
        on: {
          triggerStart: {
            target: 'playing',
          },
        },
      },
      playing: {
        after: {
          500: {
            actions: 'tick',
            target: 'playing',
          },
        },
        on: {
          triggerPause: {
            target: 'paused',
          },
          triggerEndNight: {
            actions: 'endNight',
            target: 'paused',
          },
        },
      },
      paused: {
        on: {
          triggerStart: {
            target: 'playing',
          },
        },
      },
      finished: {},
    },
    schema: {
      context: {} as {
        persons: ActorRefFrom<typeof personMachine>[];
        clock: number;
      },
      events: {} as
        | { type: 'onAddPerson' }
        | { type: 'onRemovePerson'; id: string }
        | { type: 'onRemoveLastPerson' }
        | { type: 'triggerStart' }
        | { type: 'triggerPause' }
        | { type: 'triggerEndNight' }
        | { type: 'triggerGameOver' },
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
            spawn(personMachine, MathUtils.generateUUID()),
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
      removeLastPerson: assign((context) => {
        return {
          ...context,
          persons: [...context.persons.slice(0, -1)],
        };
      }),
      tick: assign((context) => {
        const clock = context.clock + METERS_CONFIG.clock.incrementValue;
        if (clock >= METERS_CONFIG.clock.maxValue) send('triggerEndNight');
        return {
          ...context,
          clock: METERS_CONFIG.clock.clamp(clock),
        };
      }),
      endNight: assign((context) => {
        return {
          ...context,
          clock: METERS_CONFIG.clock.initialValue,
        };
      }),
    },
  },
);
