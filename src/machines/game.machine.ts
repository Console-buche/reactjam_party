import { type ActorRefFrom, assign, createMachine, spawn } from 'xstate';
import { MathUtils } from 'three';

import { personMachine } from './person.machine';
import { barMachine } from './bar.machine';
import { toiletMachine } from './toilet.machine';

const generateRandomDisasters = (night: number) => {
  const getRandomDisasterName = () =>
    disasterNames[MathUtils.randInt(1, disasterNames.length)];

  const disasters = Array.from({ length: night + 1 }, () => ({
    time: MathUtils.randInt(3, length),
    disasterName: getRandomDisasterName(),
  }));

  disasters.sort((a, b) => a.time - b.time);
  return disasters;
};

const METERS_CONFIG = {
  clock: {
    initialValue: 0,
    incrementValue: 5,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.clock.maxValue),
  },
};

export type HotSpots = {
  bar: ActorRefFrom<typeof barMachine>;
  toilet: ActorRefFrom<typeof toiletMachine>;
};

const disasterNames = ['onBlackout', 'onPolice', 'onFire'];

export const gameMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMBiA9gOwEEIIAFMAJ1nwG0AGAXUVAAcdYBLAF3fyZAA9EAJgBsADgB0tAMwBGIQFZZtcQHYALLNnqANCACeiaQE5VE2UtVjjY9VbHSRAXyd60mXHgBKYdDgBuYGSUNAx8rBzcvEgCwupSIrRCxtIKiUJC0qo2eoYIJmYWstlW0kJiIsbGLm4Y2Pg+foEAMqiwnMFUeHSMMRFcPHh8ggjqxvHaKurSco5jDrmIALTyshJK6mJimWIKe5mqNSDu2Jzk7FAw5CcA8oHkPeFsA9GgI4rxQrJiqgr2qbRVKlFggVgopL8tlUHLRYQpqq5jnUJHgcJwAMqcVDkTiQLBnC5XTHYziPPrPKJDGIjdTgpLyZLGBSw4wiCwiEHMiTqRSVdTTVTJBQ8o4nCTMAA2qH07DwUHx50uFBIqAArrAwGSWBTBsNEOpaBJjLQDXYhLSLTyQUIZOs9hZpICfntpGJRcjJdLZfL+O1ULiJKgAGa48gACmZtAAlFgxZ6ZXKtSB+pS9aDlCIJCJszncznjCDtEIs3nS9n3ZhxWqNRAFYSKMScUmU7rqcJbbQ0vJjcYMmyUtbbXslApHVZfsKXIjURA4HwTk9Iq23ssLPEy6WCwZV9n1pDrDZHbDnIixaiMVicZBFy8qSuEFzNlVsq7HGJOwoQWCIQooYfYZ2FQVmA4pSgmUA3qmbYPoUqgaEC5QGr+qgqIWmTctmZQaLsv4GtIwFVuq17kkuryxDB5hweoIgKIygLmp+24IOUxZCChuwiAanG2OoBFBrK7CwAAFsR2qkXe5HlJmuwpJU2Y2L8JqcoaPJ-EkPIZGIxRCFOThAA */
    id: 'Game',
    description:
      'The game machine is the root machine of the game, it handles the game state.',
    context: {
      persons: [spawn(personMachine, MathUtils.generateUUID())],
      hotspots: {
        bar: spawn(barMachine, MathUtils.generateUUID()),
        toilet: spawn(toiletMachine, MathUtils.generateUUID()),
      },
      clock: METERS_CONFIG.clock.initialValue,
      currentNight: 0,
      meters: {
        hype: 0,
      },
      disasterForTheNight: [],
    },
    entry: assign((context) => {
      const disasterForTheNight = generateRandomDisasters(context.currentNight);
      return {
        ...context,
        disasterForTheNight,
      };
    }),
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
              // game tick
              actions: assign((context) => {
                const clock =
                  context.clock + METERS_CONFIG.clock.incrementValue;

                return {
                  ...context,
                  clock: METERS_CONFIG.clock.clamp(clock),
                };
              }),
              target: 'playing',
            },
            {
              cond: (context) => context.clock >= METERS_CONFIG.clock.maxValue,
              target: 'finished',
            },
          ],
        },
        on: {
          onPause: {
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
    on: {
      onIncrementHype: {
        actions: assign((context, event) => {
          return {
            ...context,
            meters: {
              ...context.meters,
              hype: context.meters.hype + event.hype,
            },
          };
        }),
      },
      onDecrementHype: {
        actions: assign((context, event) => {
          return {
            ...context,
            meters: {
              ...context.meters,
              hype: context.meters.hype - event.hype,
            },
          };
        }),
      },
      onAddPerson: {
        actions: assign((context) => {
          return {
            ...context,
            persons: [
              ...context.persons,
              spawn(personMachine, MathUtils.generateUUID()),
            ],
          };
        }),
      },
      onRemovePerson: {
        actions: assign((context, event) => {
          return {
            ...context,
            persons: [
              ...context.persons.filter((machine) => machine.id !== event.id),
            ],
          };
        }),
      },
      onRemovePersonFromAllHotspots: {
        actions: (context, event) => {
          const { bar, toilet } = context.hotspots;
          bar.send({
            type: 'onUnregisterPerson',
            person: event.person,
          });
          toilet.send({
            type: 'onUnregisterPerson',
            person: event.person,
          });
          return context;
        },
      },
      onGameOver: {
        target: 'finished',
      },
    },
    // ------------------------------------------
    schema: {
      context: {} as {
        persons: ActorRefFrom<typeof personMachine>[];
        hotspots: HotSpots;
        clock: number;
        currentNight: number;
        meters: {
          hype: number;
        };
        disasterForTheNight: Record<number, (typeof disasterNames)[number]>[];
      },
      events: {} as
        | { type: 'onIncrementHype'; hype: number }
        | { type: 'onDecrementHype'; hype: number }
        | { type: 'onAddPerson' }
        | { type: 'onRemovePerson'; id: string }
        | {
            type: 'onRemovePersonFromAllHotspots';
            person: ActorRefFrom<typeof personMachine>;
          }
        | { type: 'onStart' }
        | { type: 'onPause' }
        | { type: 'onGameOver' }
        | { type: 'onBlackout' }
        | { type: 'onPolice' }
        | { type: 'onFire' },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./game.machine.typegen').Typegen0,
  },
  {},
);
