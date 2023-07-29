import {
  type ActorRefFrom,
  assign,
  createMachine,
  spawn,
  interpret,
} from 'xstate';
import { MathUtils } from 'three';

import { personMachine } from './person.machine';
import { barMachine } from './bar.machine';
import { toiletMachine } from './toilet.machine';
import { buffetMachine } from './buffet.machine';
import { dancefloorMachine } from './dancefloor.machine';
import { sofaMachine } from './sofa.machine';
import { lobbyMachine } from './lobby.machine';

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
  buffet: ActorRefFrom<typeof buffetMachine>;
  dancefloor: ActorRefFrom<typeof dancefloorMachine>;
  sofa: ActorRefFrom<typeof sofaMachine>;
  lobby: ActorRefFrom<typeof lobbyMachine>;
};

const disasterNames = ['onBlackout', 'onPolice', 'onFire'];

export const gameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMBiA9gOwEk8BjAJzEzwBcAJATwAcwBtABgF1FQGdYBLKn3xcQAD0QBmABxSAdABYATAE4AbAFZlAdi2sAjHsUSANCDqI9rLbOXqJeiSt2KZirQF93ptJlx4AImBkFGDU9ExsnEggPPyCwtHiCNLqsnpSWvJq8qpSrI5WpuYIhp7eGNj4AIIQEAAKYKSw+JEisQJCeCJJ8qzyaVrp6npaRoqqeupFiMoSqrJShuqDElbyEsplID6VeABKFDgAbmANTS0cbbwdCaBJ0soLUm5S9hLqqlof0wiZ-cqsVQuDLyUasIxbHZ+A7oY6nRrNPAAMVIOHQVQANhiaDgqLAeHjWtF2vEuolJC4bIp0qptKxho4Rj8pL0Fpp1q8JIN1KwpJCKn4dgB5E6kInca6k7qIHQ-TQSNIfFT2OxqDb8zCyPC4gDKVFQpCokD8eoNVHFMUlnWlCCMrFkG3pMmUeXSYx+oMUCkBLlYynklg08g1YFkDAxqDofDwUD8dVQAFdYCxLsSrbcxIg7Q6Aepna7no4fly9N6gRpHBllA4JCGwxGozGsKJYPqjbJUAAzI2kAAUPNYAEosDt65Ho1ALSTreTkhNZH1cioAwGdFJi6NZKp8pMMnplMpFPI+V5thUx43Yy226Guz3+6whyPz+HxzHmHoohK4jO7ohhl6folhs+4HhsHqDLI6hKiy4wSHMqhzHWDCJsmEAmvqhpTumZJ-raqw5k6UguvohaKB61I2D6GzER8vL0p4p7ahAcAiDsVw-hmSQqD8QxUeW7L0loFZ1tqVCmoakAcTcuGZggswLpMyy5Fo-p2HYEFegCQLaHRozQbWp6jq+l7SVKs5cqkyzgrk8hZIoj4mGYiCgva0HluCei5Jo6jIahUlppxslJJYCqOnmijqHZAYGE5xQrg6ijLr0KV5v6dadtGfCwAAFgF34yTawmpAeB5ZPZOSqKocpSPMvRAq8UX2AYjHuEAA */
  id: 'Game',
  description:
    'The game machine is the root machine of the game, it handles the game state.',
  context: {
    persons: [],
    hotspots: {
      bar: interpret(barMachine, { id: MathUtils.generateUUID() }).start(),
      toilet: interpret(toiletMachine, {
        id: MathUtils.generateUUID(),
      }).start(),
      buffet: interpret(buffetMachine, {
        id: MathUtils.generateUUID(),
      }).start(),
      dancefloor: interpret(dancefloorMachine, {
        id: MathUtils.generateUUID(),
      }).start(),
      sofa: interpret(sofaMachine, { id: MathUtils.generateUUID() }).start(),
      lobby: interpret(lobbyMachine, { id: MathUtils.generateUUID() }).start(),
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
    console.log('game is starting');
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
              console.log('game tick');
              const clock = context.clock + METERS_CONFIG.clock.incrementValue;

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
        console.log('Game.onRemovePersonFromAllHotspots');
        const { bar, toilet, buffet, dancefloor, lobby, sofa } =
          context.hotspots;
        bar.send({
          type: 'onUnregisterPerson',
          person: event.person,
        });
        toilet.send({
          type: 'onUnregisterPerson',
          person: event.person,
        });
        buffet.send({
          type: 'onUnregisterPerson',
          person: event.person,
        });
        dancefloor.send({
          type: 'onUnregisterPerson',
          person: event.person,
        });
        lobby.send({
          type: 'onUnregisterPerson',
          person: event.person,
        })
        sofa.send({
          type: 'onUnregisterPerson',
          person: event.person,
        })
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
});
