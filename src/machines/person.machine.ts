import { MathUtils } from 'three';
import { assign, createMachine, sendParent } from 'xstate';
import { getRandomName } from '../helpers/getRandomNames';

const METERS_CONFIG = {
  hydration: {
    initialValue: 0,
    incrementValue: 10,
    decrementValue: 10,
    maxValue: 100,
    clamp: (v: number) =>
      MathUtils.clamp(v, 0, METERS_CONFIG.hydration.maxValue),
  },
  urine: {
    initialValue: 100,
    incrementValue: 10,
    decrementValue: 10,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.urine.maxValue),
  },
  fun: {
    initialValue: 100,
    incrementValue: 10,
    decrementValue: 10,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.fun.maxValue),
  },
  satiety: {
    initialValue: 100,
    incrementValue: 10,
    decrementValue: 10,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.satiety.maxValue),
  },
};

// -----------------------------------------------------------------
export const personMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAUwCdYHsB2BiHAqtmmFAJawAu6AYmpgLYCCANiwBKaWwAOXA2gAYAuolB9YZSmRxiQAD0QAWAEwAaEAE9lARgCsAOgCcegMw6AbCtOC9ADhUqLAX2cbUGHAYCGAY2k4NCyYAO64lGhkUDBoqGBCokggElIy2HKKCEbqWohGgkYGSoJWRvl6+nYA7Cqu7uhY2D7+aUGh4ZHR6AAikdgA1glyKQHpSZnVGtoIOjqmKgamekY22VVKOg52dSAejQYMYNRobSEGAJLYftIAbmAdUTEAypTeaJRDSSNpGYg6RjoDIJgcDqisLGC9FNEOZClVBOZzHp7BD7FUdnsvIdjqcDEwWndcPIqN5qD4AGbHAAUemBAEpcJimtjaMEzvjbvERMNMJJRr8EKZTEpFjoVLSdFULKZqjLoQhHIVacCVIIVEolOCLHpXG4QNhMBA4HImTy+T9xogALTq+U20zGMpGOyCKp6JTat16dF6pnNUanM2pWSWwVGeXwkX5KyWAqzF21X0NLzXVpsi4QFhgIP80PZeV2WnGEoqGoWIwQ50++qeJqpwLpgCipLI2CgOYtoEyOmBBhUdnKFSqbo2wvlPf0i2WGuBGslGwxybrLQboQMyAokjbHZDXcQ1iqBm9dlmAKU1XhFiq8pWC2l-b00vhZgsSkXtf9abXTyk0m3X15YMxj3GZe37QdJRHOYlHHaw7FFdUKzmCwLHjd99nrbBcW6bxsF8Vt2wA81dwUP4wIHWwhygsdclAqoHULIwPWlZ07FKdCUxXLD016Vt+gIndgNIhVTEPY9Tx0c9hxKa9aNmZEj0LOwBz0ftbFMDjlwDdMABkwG8G4BKIoCBUlCxRVMaVLNQ0tC1k6YqmyIoSw9YVHAnTSDiOVlQkEgVbTk1QgRBTZ+ylGV1k8lkTnTS5UzuPzQxqeV5kEPsEUg1RC37HQou8mK1w5MgEuM3MQOFQEqhPcVlLFb17JhUsijMOZlgqaDct1IA */
    id: 'Person',
    description:
      'A person is a character in the game, with its needs and actions.',
    type: 'parallel',
    initial: 'actionFlow',
    entry: assign((context) => ({
      ...context,
      name: getRandomName(),
    })),
    context: {
      name: '',
      meters: {
        fun: METERS_CONFIG.fun.initialValue,
        satiety: METERS_CONFIG.satiety.initialValue,
        hydration: METERS_CONFIG.hydration.initialValue,
        urine: METERS_CONFIG.urine.initialValue,
      },
    },
    on: {
      onUnregisterFromAllHotspot: {
        target: 'actionFlow.Idle',
        actions: assign((context, _, meta) => {
          console.log('Person.onUnregisterFromAllHotspot');
          sendParent({
            type: 'onRemovePersonFromAllHotspots',
            personID: meta._event.origin,
          });
          return context;
        }),
      },
    },
    states: {
      actionFlow: {
        on: {
          triggerPee: {
            target: '#Person.actionFlow.Pissing',
            actions: assign((context) => {
              return {
                ...context,
                meters: {
                  ...context.meters,
                  urine: METERS_CONFIG.urine.clamp(
                    context.meters.urine - METERS_CONFIG.urine.decrementValue,
                  ),
                },
              };
            }),
          },
          triggerDrink: {
            target: '#Person.actionFlow.Drinking',
            actions: assign((context) => {
              console.log('person is drinking');
              return {
                ...context,
                meters: {
                  ...context.meters,
                  hydration: METERS_CONFIG.hydration.clamp(
                    context.meters.hydration -
                      METERS_CONFIG.hydration.decrementValue,
                  ),
                  urine: METERS_CONFIG.urine.clamp(
                    context.meters.urine + METERS_CONFIG.urine.incrementValue,
                  ),
                },
              };
            }),
          },
        },
        initial: 'Idle',
        states: {
          Idle: {},
          Eating: {},
          Pissing: {},
          Sitting: {},
          Dancing: {},
          Drinking: {},
          Leaving: {},
        },
      },
      meterFlow: {
        initial: 'Inactive',
        states: {
          Inactive: {
            on: {
              triggerStart: 'Active',
            },
          },
          Active: {
            after: {
              '500': [
                {
                  actions: 'tickNeeds',
                  target: '#Person.meterFlow.Active',
                },
              ],
            },
          },
        },
      },
    },
    schema: {
      context: {} as {
        name: string;
        meters: {
          fun: number; // more is good
          hydration: number; // more is good
          satiety: number; // more is good
          urine: number; // less is good
        };
      },
      events: {} as
        | { type: 'triggerStart' } // enable the meterFlow (needs etc.)
        | { type: 'onUnregisterFromAllHotspot' } // when the person is removed from an hotspot
        // actions
        | { type: 'triggerEat' }
        | { type: 'triggerPee' }
        | { type: 'triggerSeat' }
        | { type: 'triggerDance' }
        | { type: 'triggerDrink' },
      actions: {} as { type: 'tickNeeds' },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./person.machine.typegen').Typegen0,
  },
  {
    actions: {
      tickNeeds: assign((context) => {
        return {
          ...context,
          meters: {
            ...context.meters,
            hydration: METERS_CONFIG.hydration.clamp(
              context.meters.hydration + METERS_CONFIG.hydration.incrementValue,
            ),
          },
        };
      }),
    },
  },
);
