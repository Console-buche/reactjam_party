import { MathUtils } from 'three';
import { assign, createMachine, send, spawn, type ActorRefFrom } from 'xstate';

import {
  disasterNames,
  generateRandomDisasters,
} from '../helpers/getRandomDisasters';
import { barMachine } from './bar.machine';
import { buffetMachine } from './buffet.machine';
import { dancefloorMachine } from './dancefloor.machine';
import { lobbyMachine } from './lobby.machine';
import { personMachine } from './person.machine';
import { sofaMachine } from './sofa.machine';
import { toiletMachine } from './toilet.machine';

export const METERS_CONFIG = {
  clock: {
    initialValue: 0,
    incrementValue: 1,
    maxValue: 600,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.clock.maxValue),
  },
};

export const gameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMBiA9gOwEk8BjAJzEzwBcAJATwAcwBtABgF1FQGdYBLKn3xcQAD0QBmABxSAdABYATAE4AbAFZlAdi2sAjHsUSANCDqI9rLbOXqJeiSt2KZirQF93ptJlx4AImBkFGDU9ExsnEggPPyCwtHiCNLqsnpSWvJq8qpSrI5WpuYIhp7eGNj4AIIQEAAKYKSw+JEisQJCeCJJ8qzyaVrp6npaRoqqeupFiMoSqrJShuqDElbyEsplID6VeABKFDgAbmANTS0cbbwdCaBJ0soLUm5S9hLqqlof0wiZ-cqsVQuDLyUasIxbHZ+A7oY6nRrNPAAMVIOHQVQANhiaDgqLAeHjWtF2vEuolJC4bIp0qptKxho4Rj8pL0Fpp1q8JIN1KwpJCKn4dgB5E6kInca6k7qIHQ-TQSNIfFT2OxqDb8zCyPC4gDKVFQpCokD8eoNVHFMUlnWlCCMrFkG3pMmUeXSYx+oMUCkBLlYynklg08g1YFkDAxqDofDwUD8dVQAFdYCxLsSrbcxIg7Q6Aepna7no4fly9N6gRpHBllA4JCGwxGozGsKJYPqjbJUAAzI2kAAUPNYAEosDt65Ho1ALSTreTkhNZH1cioAwGdFJi6NZKp8pMMnplMpFPI+V5thUx43Yy226Guz3+6whyPz+HxzHmHoohK4jO7ohhl6folhs+4HhsHqDLI6hKiy4wSHMqhzHWDCJsmEAmvqhpTumZJ-raqw5k6UguvohaKB61I2D6GzER8vL0p4p7ahAcAiDsVw-hmSQqD8QxUeW7L0loFZ1tqVCmoakAcTcuGZggswLpMyy5Fo-p2HYEFegCQLaHRozQbWp6jq+l7SVKs5cqkyzgrk8hZIoj4mGYiCgva0HluCei5Jo6jIahUlppxslJJYCqOnmijqHZAYGE5xQrg6ijLr0KV5v6dadtGfCwAAFgF34yTawmpAeB5ZPZOSqKocpSPMvRAq8UX2AYjHuEAA */
  id: 'Game',
  description:
    'The game machine is the root machine of the game, it handles the game state.',
  context: {
    persons: [],
    hotspots: {
      // Cannot transform this in array because we need to access it by name in r3f to map it to the right mesh
      buffet: null as unknown as ActorRefFrom<typeof buffetMachine>,
      bar: null as unknown as ActorRefFrom<typeof barMachine>,
      dancefloor: null as unknown as ActorRefFrom<typeof dancefloorMachine>,
      sofa: null as unknown as ActorRefFrom<typeof sofaMachine>,
      toilet: null as unknown as ActorRefFrom<typeof toiletMachine>,
      lobby: null as unknown as ActorRefFrom<typeof lobbyMachine>,
    },
    clock: METERS_CONFIG.clock.initialValue,
    currentNight: 0,
    meters: {
      hype: 0,
    },
    disasterForTheNight: [],
    guideText: '',
  },
  entry: assign((context) => {
    return {
      ...context,
      hotspots: {
        buffet: spawn(buffetMachine),
        bar: spawn(barMachine),
        dancefloor: spawn(dancefloorMachine),
        sofa: spawn(sofaMachine),
        toilet: spawn(toiletMachine),
        lobby: spawn(lobbyMachine),
      },
      disasterForTheNight: generateRandomDisasters(context.currentNight),
    };
  }),
  initial: 'notStarted',
  states: {
    notStarted: {
      on: {
        onStart: {
          target: 'playing',
          actions: send('onAddPerson')
        }
      },
    },
    playing: {
      after: {
        1000: [
          {
            cond: (context) => context.clock >= METERS_CONFIG.clock.maxValue,
            target: 'finished',
            actions: () => {
              console.log('Game over, no more time');
            }
          },
          {
            cond: (context) => context.persons.length === 0,
            target: 'finished',
            actions: () => {
              console.log('Game over, no more persons');
            }
          },
          {
            // game tick
            actions: assign((context) => {
              const clock = context.clock + METERS_CONFIG.clock.incrementValue;
              return {
                ...context,
                clock: METERS_CONFIG.clock.clamp(clock),
              };
            }),
            target: 'playing',
          },
        ],
      },
      on: {
        onPause: 'paused',
        onIncrementHype: {
          actions: assign((context, event) => {
            return {
              ...context,
              meters: {
                ...context.meters,
                hype: Math.round(context.meters.hype + event.hype),
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
          actions: [
            send((_, { person }) => ({
              type: 'onRemovePersonFromAllHotspots',
              person: person,
            })),
            assign((context, { person }) => {
              console.log('Game.onRemovePerson');
              person.stop ? person.stop() : null;
              return {
                ...context,
                persons: context.persons.filter(
                  (actor) => actor.id !== person.id,
                ),
              };
            }),
          ],
        },
        onRemovePersonFromAllHotspots: {
          actions: (context, event) => {
            // console.log('Game.onRemovePersonFromAllHotspots');
            Object.keys(context.hotspots).forEach((hotspotName) => {
              context.hotspots[
                hotspotName as keyof typeof context.hotspots
              ].send({
                type: 'onUnregisterPerson',
                person: event.person,
              });
            });
            return context;
          },
        },
      },
    },
    paused: {
      on: {
        onStart: 'playing',
      },
    },
    finished: {
      type: 'final',
    },
  },
  on: {
    onGameOver: 'finished',
  },
  // ------------------------------------------
  schema: {
    context: {} as {
      persons: ActorRefFrom<typeof personMachine>[];
      hotspots: {
        bar: ActorRefFrom<typeof barMachine>;
        toilet: ActorRefFrom<typeof toiletMachine>;
        dancefloor: ActorRefFrom<typeof dancefloorMachine>;
        sofa: ActorRefFrom<typeof sofaMachine>;
        lobby: ActorRefFrom<typeof lobbyMachine>;
        buffet: ActorRefFrom<typeof buffetMachine>;
      };
      clock: number;
      currentNight: number;
      meters: {
        hype: number;
      };
      disasterForTheNight: Record<number, (typeof disasterNames)[number]>[];
      guideText: string;
    },
    events: {} as
      | { type: 'onIncrementHype'; hype: number }
      | { type: 'onDecrementHype'; hype: number }
      | { type: 'onAddPerson' }
      | { type: 'onRemovePerson'; person: ActorRefFrom<typeof personMachine> }
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
