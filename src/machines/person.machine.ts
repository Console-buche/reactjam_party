import { MathUtils } from 'three';
import { assign, createMachine, type ActorRefFrom, sendParent } from 'xstate';
import { names } from './person.constants';

const METERS_CONFIG = {
  thirst: {
    initialValue: 0,
    incrementValue: 10,
    decrementValue: 10,
    maxValue: 100,
    clamp: (v: number) => MathUtils.clamp(v, 0, METERS_CONFIG.thirst.maxValue),
  },
  pee: {
    initialValue: 100,
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
    /** @xstate-layout N4IgpgJg5mDOIC5QAUwCdYHsB2A6AhgMYAuAljgGIA2mA7gMTFqlQxqpgDaADALqKgADplikyOASAAeiAOwAmADQgAnogCcAFnm4AzPoOGDAX2PLUGHARLls1Oo2at0AEWbYA1j35IQw0eLYkjIICspqCACMkQAcurhxRkmm5uhYeESB9rS4AEpwZNhQuACSEFRg9Dhu+FDekv5itsGIAKwxMbgAbK1d8q3hiF1dkbjciUkmZiAW6dZZNDn5sIXFZRX0Uiv4xGAEAGa7aAAUkdznAJT0s1aZttl5BaRFpeVcfA0iTRK+IZq6XT0-1kA1UbVamlw-RSMzStxslEWjxWz2KNVYqKq2DcmEE9V8jUCLQQ6i6kP6gyi3C68XGk0MMJuGQRdiRy1WuHRUEx1TQuM4kR8Qi+RN+GjJUNBER6slwkWGCsVw1ajLhzIWdGRHK5POxfLx8iFfhFzTFCHanR6fSlQzOuHa9KmqUs6vuSJcmF16PxwoCptAf24o10wJtCABKumTPmbs1HtRnPcHkxW2IOz2+EO6FO524V2jd0Rcc9Lzcz2TRR9xr9PwDiEi8lkgPkpJiIMpZNauFkdPkXVkMVaALbqpdMaLOXjpaTKe2uwORxzl2uavHrOLCbLnlRAqNhP90kQMSUYKi6i7kedc0L68nJeKyFIsFERU2c4zWZOZ2XBZZDynD5Pi+dQfASJq1oeUSNp0x7cLoDZhpoba4OecR9gOQ5dG2mijtef7uveuCPs+s5pvOmaLt+eYrmON7-oRxHAbunw1kEZq6OowahpS8GypesK0fhmoAEI0IQFaASRRQABKkAAtrAYBUPs9BVvuEEhLo3Bdtw6i6O2p4xNEeiOk6AlzHJYBHA8JTYHcABulRMCwbAAMppmgxBqeBbF1gg8i6F28ixAog76ZEsjypElKREOXa6PImiRCGQYNv8OFRqulnWUiACCNiOViAAqpDid5rHEiGOjyH2EJnOFkVdDFSWjLFsiaP2IaaK0TZdKY0zYJgEBwJITIsd8vmQQAtI2lIzZCuZwdpEU9UZ0KZYJGq0ONop+cFMXjLh8JbVqqI7QemkdEC+mIcM3atOcyW6a06jyB0fUbXhJ3sgm6xgOdGmIN16gdkO9pHa6E6ndOtTckUAOTSERnBghHYSnSpkQ2u9FnWBFVmg2b1Qq2BkRJo5y4N1iTqB0DbqCC-G-idAGJuWuO+hNxLJf0koDqjp6yAo3a9v2YVYbIWN0QRCaMez1acwTCWytEkVtmG7SyvIIsYcOEufcdsY5KJmDiXL6mI0MIMCzVCQGB12ivX08iS0JRtiRJRFAaiskKUp+wI1zEWUkZ3AmaZuhY9l6DZAHZoxKHwVtm9Q6RY10Wntz8QyiGNKyACugdJHVnR0itkOf9eMK35DadInoUpxFUUxXFCSJcl5PRIlIZFzlmr5WQjmx35+myrp+nJw18rN42lPcO1nWaN1vX9cYQA */
    id: 'Person',
    description:
      'A person is a character in the game, with its needs and actions.',
    type: 'parallel',
    initial: 'actionFlow',
    entry: assign((context) => ({
      ...context,
      name: names[MathUtils.randInt(0, names.length - 1)],
    })),
    context: {
      name: '',
      meters: {
        thirst: METERS_CONFIG.thirst.initialValue,
        pee: METERS_CONFIG.pee.initialValue,
        hype: METERS_CONFIG.hype.initialValue,
      },
      action: 'none',
    },
    on: {
      onUnregisterFromAllHotspot: {
        actions: assign((context, _, meta) => {
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
            target: '#Person.actionFlow.Doing.Pissing',
          },
          triggerDrink: {
            target: '#Person.actionFlow.Doing.Drinking',
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
                      target: '#Person.actionFlow.Resting.Idle',
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
                      target: '#Person.actionFlow.Doing.Drinking',
                      cond: 'isActionDrink',
                    },
                    {
                      target: '#Person.actionFlow.Doing.Pissing',
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
                      target: '#Person.actionFlow.Doing.Drinking',
                      cond: 'isThirsty',
                      actions: ['drink', 'increaseHype'],
                    },
                    {
                      target: '#Person.actionFlow.Blocking',
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
                      target: '#Person.actionFlow.Resting',
                      cond: 'isPeeEmpty',
                    },
                  ],
                },
              },
            },
            on: {
              onDrag: {
                target: '#Person.actionFlow.Resting.Dragging',
              },
            },
          },
          Blocking: {
            initial: 'PissingHimself',
            states: {
              PissingHimself: {
                always: {
                  target: '#Person.actionFlow.Resting',
                },
              },
            },
          },
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
                  actions: 'updateNeeds',
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
        action: 'none' | 'drink' | 'piss';
        meters: {
          thirst: number;
          hype: number;
          pee: number;
        };
        name: string;
      },
      events: {} as
        | { type: 'onDrag' }
        | { type: 'onDrop'; action: 'drink' | 'piss' | 'none' }
        | { type: 'triggerPee' }
        | { type: 'triggerDrink' }
        | { type: 'triggerStart' }
        | { type: 'onUnregisterFromAllHotspot' }
        | { type: 'onTick' },
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
