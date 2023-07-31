import { MathUtils } from 'three';
import { assign, createMachine, sendParent } from 'xstate';
import { getRandomName } from '../helpers/getRandomNames';

export const METERS_CONFIG = {
  hydration: {
    initialValue: 75,
    step: 1,
    maxValue: 100,
    clamp: (v: number) =>
      MathUtils.clamp(v, 0, METERS_CONFIG.hydration.maxValue),
  },
  fun: {
    initialValue: 75,
    step: 1,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.fun.maxValue),
  },
  satiety: {
    initialValue: 75,
    step: 1,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.satiety.maxValue),
  },
  urine: {
    initialValue: 25,
    step: 1,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.urine.maxValue),
  },
} as const;

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
      self: null as unknown,
      meters: {
        fun: METERS_CONFIG.fun.initialValue,
        satiety: METERS_CONFIG.satiety.initialValue,
        hydration: METERS_CONFIG.hydration.initialValue,
        urine: METERS_CONFIG.urine.initialValue,
      },
    },
    on: {
      onUnregisterFromAllHotspot: {
        target: '#Person.actionFlow.Idle',
        actions: sendParent((context) => ({
          type: 'onRemovePersonFromAllHotspots',
          person: context.self,
        })),
      },
    },
    states: {
      actionFlow: {
        on: {
          // on hotspot toilet
          onToilet: {
            target: '#Person.actionFlow.Pissing',
            actions: assign((context) => {
              // console.log('pissing, updating meters', context.name);
              return {
                ...context,
                meters: {
                  ...context.meters,
                  urine: METERS_CONFIG.urine.clamp(
                    context.meters.urine - METERS_CONFIG.urine.step * 4,
                  ),
                },
              };
            }),
          },
          // on hotspot bar
          onBar: {
            target: '#Person.actionFlow.Drinking',
            actions: assign((context) => {
              // console.log('drinking, updating meters', context.name);
              return {
                ...context,
                meters: {
                  ...context.meters,
                  hydration: METERS_CONFIG.hydration.clamp(
                    context.meters.hydration + METERS_CONFIG.hydration.step * 3,
                  ),
                  urine: METERS_CONFIG.urine.clamp(
                    context.meters.urine + METERS_CONFIG.urine.step,
                  ),
                },
              };
            }),
          },
          // on hotspot dancefloor
          onDancefloor: {
            target: '#Person.actionFlow.Dancing',
            actions: assign((context) => {
              // console.log('Dancing, updating meters', context.name);
              const shouldntEarnFun =
                context.meters.hydration <= 0 ||
                context.meters.satiety <= 0 ||
                context.meters.urine >= 100;

              return {
                ...context,
                meters: {
                  ...context.meters,
                  fun: shouldntEarnFun ? context.meters.fun : METERS_CONFIG.fun.clamp(
                    context.meters.fun + METERS_CONFIG.fun.step * 3,
                  ),
                  satiety: METERS_CONFIG.satiety.clamp(
                    context.meters.satiety - METERS_CONFIG.satiety.step,
                  ),
                },
              };
            }),
          },
          // on hotspot sofa
          onSofa: {
            target: '#Person.actionFlow.Sitting',
            actions: assign((context) => {
              // console.log('Sitting, updating meters', context.name);

              const shouldntEarnFun =
                context.meters.hydration <= 0 ||
                context.meters.satiety <= 0 ||
                context.meters.urine >= 100;

              return {
                ...context,
                meters: {
                  ...context.meters,
                  fun: shouldntEarnFun ? context.meters.fun : METERS_CONFIG.fun.clamp(
                    context.meters.fun + METERS_CONFIG.fun.step * 1.5,
                  ),
                  hydration: METERS_CONFIG.hydration.clamp(
                    context.meters.hydration - METERS_CONFIG.hydration.step,
                  ),
                },
              };
            }),
          },
          // on hotspot buffet
          onBuffet: {
            target: '#Person.actionFlow.Eating',
            actions: assign((context) => {
              // console.log('Eating, updating meters', context.name);
              return {
                ...context,
                meters: {
                  ...context.meters,
                  satiety: METERS_CONFIG.satiety.clamp(
                    context.meters.satiety + METERS_CONFIG.satiety.step * 3,
                  ),
                  urine: METERS_CONFIG.urine.clamp(
                    context.meters.urine + METERS_CONFIG.urine.step,
                  ),
                },
              };
            }),
          },
        },
        initial: 'Idle',
        states: {
          Idle: {
            after: {
              '500': [
                {
                  actions: assign((context) => {
                    return {
                      ...context,
                      meters: {
                        ...context.meters,
                        fun: METERS_CONFIG.fun.clamp(
                          context.meters.fun - METERS_CONFIG.fun.step * 2,
                        ),
                      },
                    };
                  }),
                  target: '#Person.actionFlow.Idle',
                },
              ],
            },
          },
          Eating: {},
          Pissing: {},
          Sitting: {},
          Dancing: {},
          Drinking: {},
          Leaving: {
            type: 'final',
          },
        },
      },
      meterFlow: {
        initial: 'Inactive',
        states: {
          Inactive: {
            on: {
              triggerStart: {
                target: '#Person.meterFlow.Active',
                actions: assign((context, event) => {
                  return {
                    ...context,
                    self: event.person,
                  };
                }),
              },
            },
          },
          Active: {
            on: {
              triggerPause: {
                target: '#Person.meterFlow.Inactive',
              },
            },
            after: {
              '500': [
                {
                  cond: (context) => context.meters.fun > 0,
                  //update meters
                  actions: 'updateMeters',
                  target: '#Person.meterFlow.Active',
                },
                {
                  target: '#Person.actionFlow.Leaving',
                  actions: sendParent((context) => ({
                    type: 'onRemovePerson',
                    person: context.self,
                  })),
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
        self: unknown;
        meters: {
          fun: number; // more is good
          hydration: number; // more is good
          satiety: number; // more is good
          urine: number; // less is good
        };
      },
      events: {} as
        | { type: 'triggerStart'; person: unknown } // enable the meterFlow (needs etc.)
        | { type: 'triggerPause' } // disable the meterFlow (needs etc.)
        | { type: 'onUnregisterFromAllHotspot' } // when the person is removed from an hotspot
        | { type: 'onLeave' } // when the person is leaving the party (fun <= 0)
        // actions
        | { type: 'onBuffet' }
        | { type: 'onToilet' }
        | { type: 'onSofa' }
        | { type: 'onDancefloor' }
        | { type: 'onBar' },
      actions: {} as { type: 'tickNeeds' },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./person.machine.typegen').Typegen0,
  },
  {
    actions: {
      updateMeters: assign((context) => {
        const shouldLoseFunFaster =
          context.meters.hydration <= 0 ||
          context.meters.satiety <= 0 ||
          context.meters.urine >= 100;

        const fun = shouldLoseFunFaster
          ? context.meters.fun - METERS_CONFIG.fun.step * 5
          : context.meters.fun;

        return {
          ...context,
          meters: {
            ...context.meters,
            hydration: METERS_CONFIG.hydration.clamp(
              context.meters.hydration - METERS_CONFIG.hydration.step * 0.5,
            ),
            satiety: METERS_CONFIG.satiety.clamp(
              context.meters.satiety - METERS_CONFIG.satiety.step * 0.5,
            ),
            fun,
          },
        };
      }),
    },
  },
);
