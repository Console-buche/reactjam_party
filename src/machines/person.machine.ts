import { assign, createMachine } from 'xstate';

export const personMachine = createMachine(
  {
    id: 'Person',
    description:
      'A person is a character in the game, with its needs and actions.',
    context: {
      amounts: {
        peeAmount: 25,
        drinkAmount: 10,
        hypeAmount: 50,
      },
      thirst: 0,
      hype: 50,
      action: 'none',
    },
    initial: 'Resting',
    states: {
      Resting: {
        initial: 'Idle',
        states: {
          Idle: {
            after: {
              '1000': [
                {
                  target: '#Person.Resting.Idle',
                  actions: [
                    {
                      type: 'decreaseHype',
                    },
                  ],
                },
                {
                  internal: false,
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
                  cond: 'actionIsDrink',
                },
                {
                  target: '#Person.Doing.Pissing',
                  cond: 'actionIsPiss',
                },
                {
                  target: 'Idle',
                },
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
                  cond: 'thirsty',
                  actions: [
                    {
                      type: 'drink',
                    },
                    {
                      type: 'increaseHype',
                    },
                  ],
                },
                {
                  target: '#Person.Blocking.PissingHimself',
                  cond: 'thirstFull',
                  actions: [
                    {
                      type: 'decreaseHype',
                    },
                  ],
                },
              ],
            },
          },
          Pissing: {
            after: {
              '1000': [
                {
                  cond: 'canPee',
                  actions: [
                    {
                      type: 'piss',
                    },
                  ],
                },
                {
                  target: '#Person.Resting',
                  cond: 'thirstEmpty',
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
        thirst: number;
        hype: number;
        action: 'none' | 'drink' | 'piss';
        amounts: {
          peeAmount: number;
          drinkAmount: number;
          hypeAmount: number;
        };
      },
      events: {} as
        | { type: 'onDrag' }
        | { type: 'onDrop'; action: 'drink' | 'piss' | 'none' },
      actions: {} as
        | { type: 'drink' }
        | { type: 'piss' }
        | { type: 'increaseHype' }
        | { type: 'decreaseHype' },
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
          thirst: context.thirst + context.amounts.drinkAmount,
        };
      }),
      piss: assign((context) => {
        return {
          ...context,
          thirst: context.thirst - context.amounts.peeAmount,
        };
      }),
      increaseHype: assign((context) => {
        return {
          ...context,
          hype: context.hype + context.amounts.hypeAmount,
        };
      }),
      decreaseHype: assign((context) => {
        return {
          ...context,
          hype: context.hype - context.amounts.hypeAmount,
        };
      }),
    },
    services: {},
    guards: {
      thirsty: (context, _) => {
        return context.thirst < 100;
      },
      thirstFull: (context, _) => {
        return context.thirst === 100;
      },
      actionIsDrink: (_, event) => event.action === 'drink',
      actionIsPiss: (_, event) => event.action === 'piss',
      canPee: (context, _) => context.thirst > 0,
      thirstEmpty: (context, _) => context.thirst === 0,
    },
    delays: {},
  }
);
