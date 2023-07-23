import { assign, createMachine } from 'xstate';

export const personMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAUwCdYHsB2A6ASnAC4CW2UuAkhADZgDEOAImgIZQDaADALqKgAHTLBKkc-EAA9EAFgDMADlwAmOfIUKAnAoBsyrQHY5AGhABPRAEY5lzbhla9yyzOVcArMoMBfb6dQYOATEZBTUdPSSsESsRGC4rABmcWgAFJZcmQCU9AFYeITRoVS0YNx8SCBCImLYEtIIyu4yuArumjIelgZcOgoGCjKmFgiWznK4mu5yXApuXF5qvv7o+cFF5CURUTFxCcno6ZlcOXlBhaSb4WWWFYLCoiTilQ1uBpNyBu6W7dpcGToDMMrJYdDp7NMMnJlJpNLMuHJliAzgUQpsWOwoKFGNgWJgBOUJNVHs9QA1PMDRk1JrDaTp3J4dLNLEiUetLhQMVAseQcXiCbciQ9avVEHpKd1wTJaZp9G0MlMFKzVuc0Zy2Nzscw0PiOMo7lVhU86i9ZIoVGpFFpdPpNEYJco+pMtO4jAYfqDlYE8ExMFrcRrCZViSLTQhxeYrMp9BapgYvpobApLEq-MiVT6-ei0GQANbYnaxeJJFJHbK5DO4X3FFh50JB+41Y2ihCw+wyhQzdr-dyUzzKFQIywZZoI-TuL1ravZuu8wt7EuHDLltnT9WzziC4NG0lSRBqdyteRGZMGWGfayUnQ2XAGR3TPryA+aSdBNe4ZAkWAiOfRIv7UtlxOCtvSrLMKE-b9614IUm13Bo7UpOR6Vvdxjmsd03A0V9M2KSCfygSI-wXA40iA05K3ffD6y3RsSRNMl9xkQ9Bk+RRunPd0TEjBAZB0FoehsZRmKMV07x8NM2QAIRoTAAGN802ajyAACRIABbWAwBoRJ6AbQ04IYvcEApHiXB0OwjE0PQmXmAw+N8NNsEwCA4AkFFYPoltLEpABaQ8ZVlazehkESdBw9lQk80NGNGdoPi+H5YQUf5eiBMyuAGSZIVULQHC7CKLmKa5oubMNHQHWZ2mmRM5GmGEJRsSxJl6fRMs+V1ekKtUqw1HkoFK+CxSdITpRTM8DHpRro3sRx4zkOQ4WsidJMo8DBqMhppUpLwlCaY5oVhGE0MRVbQPfWtsEUgbt0M7zXEmZx+g8Gw6rGHQrz43AmUTOZh0yCzTpWc7wI-L8CI2+6B1lFN3EBaEuDhBbKT4iZBOHIwMhkCaIpk+TrshsN2gHYTYT0aF7I8TQ+xQqYmsWppOhkFkzrWPGFLw8HQjUzTtMSQnYv4rgVGlazVC8Tp2ivaYISa2w7RsAZHO8IA */
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
  },
);
