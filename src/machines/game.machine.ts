import { type ActorRefFrom, assign, createMachine, spawn, send } from 'xstate';
import { personMachine } from './person.machine';
import { MathUtils } from 'three';
import { hotspotMachine } from './hotspot.machine';
import { barMachine } from './bar.machine';
import { toiletMachine } from './toilet.machine';

const METERS_CONFIG = {
  clock: {
    initialValue: 0,
    incrementValue: 2,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.clock.maxValue),
  },
};

const HOTSPOTS = {
  bar: barMachine,
  toilet: toiletMachine,
};

export const gameMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMBiA9gOwEEIIAFMAJ1nwG0AGAXUVAAcdYBLAF3fyZAA9EAJgBsADgB0tAMwBGIQFZZtcQHYALLNnqANCACeiaQE5VE2UtVjjY9VbHSRAXyd60mXHgBKYdDgBuYGSUNAx8rBzcvEgCwupSIrRCxtIKiUJC0qo2eoYIJmYWstlW0kJiIsbGLm4Y2Pg+foEAMqiwnMFUeHSMMRFcPHh8ggjqxvHaKurSco5jDrmIALTyshJK6mJimWIKe5mqNSDu2Jzk7FAw5CcA8oHkPeFsA9GgI4rxQrJiqgr2qbRVKlFggVgopL8tlUHLRYQpqq5jnUJHgcJwAMqcVDkTiQLBnC5XTHYziPPrPKJDGIjdTgpLyZLGBSw4wiCwiEHMiTqRSVdTTVTJBQ8o4nCTMAA2qH07DwUHx50uFBIqAArrAwGSWBTBsNEOpaBJjLQDXYhLSLTyQUIZOs9hZpICfntpGJRcjJdLZfL+O1ULiJKgAGa48gACmZtAAlFgxZ6ZXKtSB+pS9aDlCIJCJszncznjCDtEIs3nS9n3ZhxWqNRAFYSKMScUmU7rqcJbbQ0vJjcYMmyUtbbXslApHVZfsKXIjURA4HwTk9Iq23ssLPEy6WCwZV9n1pDrDZHbDnIixaiMVicZBFy8qSuEFzNlVsq7HGJOwoQWCIQooYfYZ2FQVmA4pSgmUA3qmbYPoUqgaEC5QGr+qgqIWmTctmZQaLsv4GtIwFVuq17kkuryxDB5hweoIgKIygLmp+24IOUxZCChuwiAanG2OoBFBrK7CwAAFsR2qkXe5HlJmuwpJU2Y2L8JqcoaPJ-EkPIZGIxRCFOThAA */
    id: 'Game',
    description:
      'The game machine is the root machine of the game, it handles the game state.',
    context: {
      persons: [],
      hotspots: [],
      clock: METERS_CONFIG.clock.initialValue,
      meters: {
        hype: 0,
      },
    },
    on: {
      onIncrementHype: {
        actions: ['incrementHype'],
      },
      onDecrementHype: {
        actions: ['decrementHype'],
      },
      onAddPerson: {
        actions: ['addPerson'],
      },
      onRemovePerson: {
        actions: ['removePerson'],
      },
      onAddHotspot: {
        actions: ['addHotspot'],
      },
      onRemoveHotspot: {
        actions: ['removeHotspot'],
      },
      onGameOver: {
        target: 'finished',
      },
    },
    initial: 'notStarted',
    states: {
      notStarted: {
        on: {
          onStart: {
            target: 'playing',
          },
        },
      },
      playing: {
        after: {
          500: [
            {
              actions: 'tick',
              target: 'playing',
            },
            {
              cond: (context) => context.clock >= METERS_CONFIG.clock.maxValue,
              actions: 'endNight',
            },
          ],
        },
        on: {
          onPause: {
            target: 'paused',
          },
          onEndNight: {
            actions: 'endNight',
            target: 'paused',
          },
        },
      },
      paused: {
        on: {
          onStart: {
            target: 'playing',
          },
        },
      },
      finished: {},
    },
    schema: {
      context: {} as {
        persons: ActorRefFrom<typeof personMachine>[];
        hotspots: ActorRefFrom<typeof hotspotMachine>[];
        clock: number;
        meters: {
          hype: number;
        };
      },
      events: {} as
        | { type: 'onIncrementHype'; hype: number }
        | { type: 'onDecrementHype'; hype: number }
        | { type: 'onAddPerson' }
        | { type: 'onRemovePerson'; id: string }
        | { type: 'onAddHotspot'; hotspotType: 'bar' | 'toilet' }
        | { type: 'onRemoveHotspot'; id: string }
        | { type: 'onStart' }
        | { type: 'onPause' }
        | { type: 'onEndNight' }
        | { type: 'onGameOver' },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./game.machine.typegen').Typegen0,
  },
  {
    actions: {
      incrementHype: assign((context, event) => {
        return {
          ...context,
          meters: {
            ...context.meters,
            hype: context.meters.hype + event.hype,
          },
        };
      }),
      decrementHype: assign((context, event) => {
        return {
          ...context,
          meters: {
            ...context.meters,
            hype: context.meters.hype - event.hype,
          },
        };
      }),
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
      addHotspot: assign((context, event) => ({
        ...context,
        hotspots: [
          ...context.hotspots,
          spawn(HOTSPOTS[event.hotspotType], MathUtils.generateUUID()),
        ],
      })),
      removeHotspot: assign((context, event) => {
        return {
          ...context,
          hotspots: [
            ...context.hotspots.filter((machine) => machine.id !== event.id),
          ],
        };
      }),
      tick: assign((context) => {
        const clock = context.clock + METERS_CONFIG.clock.incrementValue;
        if (clock >= METERS_CONFIG.clock.maxValue) send('EndNight');
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
