import { createMachine } from 'xstate';

export const personMachine = createMachine(
  {
    id: 'Person',
    context: {
      thirst: 0,
      hype: 50,
      action: 'none',
    },
    description: 'A person',
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
                      params: {
                        amount: 5,
                      },
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
                  target: '#Person.Doing',
                  cond: 'onAction',
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
        initial: 'BeginAction',
        states: {
          BeginAction: {
            always: [
              {
                target: 'Drinking',
                cond: 'actionIsDrink',
              },
              {
                target: 'Pissing',
                cond: 'ActionIsPiss',
              },
            ],
          },
          Drinking: {
            after: {
              '1000': [
                {
                  target: '#Person.Doing.Drinking',
                  cond: 'thirsty',
                  actions: [
                    {
                      params: {
                        amount: 10,
                      },
                      type: 'drink',
                    },
                    {
                      params: {
                        amount: 5,
                      },
                      type: 'increaseHype',
                    },
                  ],
                },
                {
                  internal: true,
                },
                {
                  target: '#Person.Blocking.PissingHimself',
                  cond: 'thirstFull',
                  actions: [
                    {
                      params: {
                        amount: 50,
                      },
                      type: 'decreaseHype',
                    },
                  ],
                },
                {
                  internal: false,
                },
              ],
            },
          },
          Pissing: {
            after: {
              '1000': [
                {
                  target: '#Person.Doing.Pissing',
                  cond: 'canPee',
                  actions: [
                    {
                      params: {
                        amount: 25,
                      },
                      type: 'piss',
                    },
                  ],
                },
                {
                  internal: false,
                },
                {
                  target: '#Person.Resting',
                  cond: 'thirstEmpty',
                  actions: [],
                },
                {
                  internal: false,
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
      },
      events: {} as { type: 'onDrag' } | { type: 'onDrop' },
      actions: {} as
        | { type: 'drink'; amount: number }
        | { type: 'piss'; amount: number }
        | { type: 'increaseHype'; amount: number }
        | { type: 'decreaseHype'; amount: number },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./person.machine.typegen').Typegen0,
  },
  {
    actions: {
      drink: (context, _, meta) => {
        context.thirst += meta.action.amount;
      },
      piss: (context, _, meta) => {
        context.thirst -= meta.action.amount;
      },
      increaseHype: (context, _, meta) => {
        context.hype += meta.action.amount;
      },
      decreaseHype: (context, _, meta) => {
        context.hype -= meta.action.amount;
      },
    },
    services: {},
    guards: {
      thirsty: (context, _) => context.thirst < 100,
      thirstFull: (context, _) => context.thirst === 100,
      onAction: (context, _) => context.action !== 'none',
      actionIsDrink: (context, _) => context.action === 'drink',
      ActionIsPiss: (context, _) => context.action === 'piss',
      canPee: (context, _) => context.thirst > 0,
      thirstEmpty: (context, _) => context.thirst === 0,
    },
    delays: {},
  }
);
