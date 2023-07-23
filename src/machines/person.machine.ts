import { MathUtils } from 'three';
import { assign, createMachine } from 'xstate';

const METERS_CONFIG = {
  thirst: {
    initialValue: 0,
    incrementValue: 10,
    decrementValue: 10,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.thirst.maxValue),
  },
  pee: {
    initialValue: 0,
    incrementValue: 10,
    decrementValue: 10,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.pee.maxValue),
  },
  hype: {
    initialValue: 50,
    incrementValue: 10,
    decrementValue: 10,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.hype.maxValue),
  },
};

// -----------------------------------------------------------------
export const personMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAUwCdYHsB2BiALmgJZQxqpgDaADALqKgAOmsR+RODIAHogCwBmAJwA6AEzUAbAEZq1IUIAcAdgCs05QBoQAT0QBaIWOnjVAXzPbUGHAWKl0AEWLYA1jXpIQzVu05feBAFpEzFVbT0EQ2NTCyt0LDxCEjIAOTBIWA8uHzYObC5A1WUTAVUBQUkhGWVqaTEIgyNQ80sQa0SRACU4dmwoEQBJCAAbMFwcZwBDKGyvXL8CgINa0UU5RWLq2TFFRqiq6hFN5Uk1RQF5C+k49oScbt6ifqHR8e5YfCn8MBEpgDMfmgABSyOQASlwHQePU+zwGwzGcyYLDy-lAgX0klUqhE1DEyj49WukgEZX2+k2khEwiJqjEu3pxmUt2h2EecJe01I8Im2GcmEYyO8qMWhQMuwEIhK0lUCmEssEYQph2OxTOqguV2CrPu7NhfQG3KgvMmaEFlGknhRvny4qiYmqIkEikVYkkxj4Kgp6pECiEciMAekQmULLabI5hpExtN-PNQrE1pFtvRPAl6xE9VU2IUiiJQj4kgpfHpzoUgcddVD4fiNnZjkwce5woWduWUT4pedfCMWoktS94V0K0J4l7dQE2JKYl7uvrMabXJcrl5Hy+Pz+gPQoLk1Ehkcb8JjK-hrdF7Yx-FDeOKinv+KJpyLFNOJlLxgEimn9TnEb1i7Hs4zyrv0uDrt8vwAkCu4QlCAFHsuIFnlaOQXmmgSuoofrGEI6iOrS5SvjIzr0tIX4-rOQjzp0iEDMgRCwKwYEQZu0E7mC+7wQudEiAxTFnnQaGpksV4IKoRI0lIOKCAIYiXJIxYjlE5TUgyOIlMowY1jRDy8fxzFQOBnyQVuMGcQeCFLvRjGGZayZthhiBlviYZBrK9K0kpkT6PS2G9gG8hViGYa6eyABCIyYAAxqBNkCf0AASRAALawGAIz-Lg54ifaOYUpxxzUMoAi1PmkjUHwjoWG02CYBAcBcGywloqJ6ZROsuLrNQJzbPiezKfoIRyUVJWnDm6z3ooYVRvCLVih2+hqMoRU9VsMj9RShZSoohbSHwPVEvUCgzQax6ImA82Xu1WKZpca3UGS0ikuSg3nD2YLCJIfBhvmp1PMuMwmv0V1OZ2qhHAyBISPSxWVZsKoBmqpznJcSg6v+PHWaDbWBMEUpVIoBK1BJuahhS+bYXhnoet+6h4TNvHAW4c3zOhuOIFOJiE8T1Ck3K5ODRqyMalq6M3JjtHWXxtmszarX2lVuI82GfNFgLWiDb6-qVtpoWSw8kUxXFOP2q6K1duU2Zbd2AX4sS2Ihq0dadEbsXHgZ8LJWlGX-KbHZ0z2VvKoNJx+hW5GUX+FhAA */
    id: 'Person',
    description:
      'A person is a character in the game, with its needs and actions.',
    context: {
      meters: {
        thirst: 0,
        pee: 0,
        hype: 0,
      },
      action: 'none',
    },
    initial: 'Resting',
    on: {
      triggerPee: {
        target: '#Person.Doing.Pissing',
      },
      triggerDrink: {
        target: '#Person.Doing.Drinking',
      },
      triggerNeeds: {
        target: '#Person.Doing.',
      },
    },
    states: {
      Resting: {
        initial: 'Idle',
        states: {
          Idle: {
            after: {
              '1000': [
                {
                  target: '#Person.Resting.Idle',
                  actions: 'decreaseHype',
                },
              ],
            },
            on: {
              onDrag: {
                target: 'Dragging',
              },
            },
          },
          Dragging: {
            on: {
              onDrop: [
                {
                  target: '#Person.Doing.Drinking',
                  cond: 'isActionDrink',
                },
                {
                  target: '#Person.Doing.Pissing',
                  cond: 'isActionPiss',
                },
                'Idle',
              ],
            },
          },
        },
      },
      Doing: {
        states: {
          Drinking: {
            after: {
              '1000': [
                {
                  target: '#Person.Doing.Drinking',
                  cond: 'isThirsty',
                  actions: ['drink', 'increaseHype'],
                },
                {
                  target: '#Person.Blocking',
                  cond: 'isPeeFull',
                  actions: ['decreaseHype', 'emptyPee'],
                },
              ],
            },
          },
          Pissing: {
            after: {
              '1000': [
                {
                  cond: 'canPee',
                  actions: 'pee',
                },
                {
                  target: '#Person.Resting',
                  cond: 'isPeeEmpty',
                },
              ],
            },
          },
        },
        on: {
          onDrag: {
            target: '#Person.Resting.Dragging',
          },
        },
      },
      Blocking: {
        initial: 'PissingHimself',
        states: {
          PissingHimself: {
            always: {
              target: '#Person.Resting',
            },
          },
        },
      },
    },
    schema: {
      context: {} as {
        action: 'none' | 'drink' | 'piss';
        meters: {
          thirst: number;
          hype: number;
          pee: number;
        };
      },
      events: {} as
        | { type: 'onDrag' }
        | { type: 'onDrop'; action: 'drink' | 'piss' | 'none' }
        | { type: 'triggerPee' }
        | { type: 'triggerDrink' }
        | { type: 'triggerNeeds' },
      actions: {} as
        | { type: 'drink' }
        | { type: 'pee' }
        | { type: 'incrementHype' }
        | { type: 'decrementHype' }
        | { type: 'updateNeeds' },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./person.machine.typegen').Typegen0,
  },
  {
    actions: {
      drink: assign((context) => {
        return {
          ...context,
          meters: {
            ...context.meters,
            thirst: METERS_CONFIG.thirst.clamp(
              context.meters.thirst - METERS_CONFIG.thirst.decrementValue,
            ),
            pee: METERS_CONFIG.pee.clamp(
              context.meters.pee + METERS_CONFIG.pee.incrementValue,
            ),
          },
        };
      }),
      pee: assign((context) => {
        return {
          ...context,
          meters: {
            ...context.meters,
            pee: METERS_CONFIG.pee.clamp(
              context.meters.pee - METERS_CONFIG.pee.decrementValue,
            ),
          },
        };
      }),
      emptyPee: assign((context) => {
        return {
          ...context,
          meters: {
            ...context.meters,
            pee: 0,
          },
        };
      }),
      increaseHype: assign((context) => {
        return {
          ...context,
          meters: {
            ...context.meters,
            hype: METERS_CONFIG.hype.clamp(
              context.meters.hype + METERS_CONFIG.hype.incrementValue,
            ),
          },
        };
      }),
      decreaseHype: assign((context) => {
        return {
          ...context,
          meters: {
            ...context.meters,
            hype: METERS_CONFIG.hype.clamp(
              context.meters.hype - METERS_CONFIG.hype.decrementValue,
            ),
          },
        };
      }),
      updateNeeds: assign((context) => {
        return {
          ...context,
          meters: {
            ...context.meters,
            thirst: METERS_CONFIG.thirst.clamp(
              context.meters.thirst + METERS_CONFIG.thirst.incrementValue,
            ),
            pee: METERS_CONFIG.pee.clamp(
              context.meters.pee + METERS_CONFIG.pee.incrementValue,
            ),
          },
        };
      }),
    },
    guards: {
      isPeeEmpty: (context) => context.meters.pee <= 0,
      isPeeFull: (context) => context.meters.pee >= 100,
      isActionDrink: (_, event) => event.action === 'drink',
      isActionPiss: (_, event) => event.action === 'piss',
      canPee: (context) => context.meters.pee > 0,
      isThirsty: (context) => context.meters.thirst > 0,
    },
  },
);
