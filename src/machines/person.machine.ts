import { assign, createMachine } from "xstate";

export const personMachine = createMachine(
  {
    id: "Person",
    context: {
      PISS_COUNT: 0,
      THIRST: 0,
    },
    description: "A person",
    initial: "Available",
    states: {
      Available: {
        initial: "Idle",
        states: {
          Idle: {
            on: {
              "on drag": "Dragged",
            },
          },
          Dragged: {
            on: {
              Dropped: [
                {
                  target: "#Person.ThirstActions.BeginAction",
                  cond: "HAS_ACTION",
                },
                {
                  target: "Idle",
                },
              ],
            },
          },
        },
      },
      ThirstActions: {
        initial: "BeginAction",
        states: {
          BeginAction: {
            always: [
              {
                target: "Drinking",
                cond: "ACTION_DRINK",
              },
              {
                target: "Pissing",
                cond: "ACTION_PISS",
              },
            ],
          },
          Drinking: {
            after: {
              "1000": [
                {
                  target: "#Person.ThirstActions.Drinking",
                  cond: "THIRST_NOT_FULL",
                  actions: [
                    {
                      params: {},
                      type: "addThirst",
                    },
                  ],
                },
                {
                  internal: true,
                },
                {
                  target: "#Person.ThirstActions.PissingHimself",
                  cond: "THIRST_FULL",
                  actions: [],
                },
                {
                  internal: false,
                },
              ],
            },
          },
          Pissing: {
            after: {
              "1000": [
                {
                  target: "#Person.ThirstActions.Pissing",
                  cond: "THRIST_NOT_EMPTY",
                  actions: [
                    {
                      params: {},
                      type: "removeThirst",
                    },
                  ],
                },
                {
                  internal: false,
                },
                {
                  target: "#Person.Available",
                  cond: "THIRST_EMPTY",
                  actions: [],
                },
                {
                  internal: false,
                },
              ],
            },
          },
          PissingHimself: {
            on: {
              "on Piss end": {
                target: "#Person.Angry",
              },
            },
          },
        },
      },
      Angry: {
        after: {
          "1000": [
            {
              target: "#Person.Angry",
              cond: "ANGER_NOT_FULL",
              actions: [
                {
                  params: {},
                  type: "addAnger",
                },
              ],
            },
            {
              internal: false,
            },
            {
              target: "#Person.Leaving",
              cond: "ANGER_FULL",
              actions: [],
            },
            {
              internal: false,
            },
          ],
        },
      },
      Leaving: {
        type: "final",
      },
    },
    schema: {
      context: {} as { PISS_COUNT: number; THIRST: number },
      events: {} as
        | { type: "on drag" }
        | { type: "Dropped" }
        | { type: "on Piss end" },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import("./person.machine.typegen").Typegen0,
  },
  {
    actions: {
      addThirst: assign((context, event) => {
        console.log(context.PISS_COUNT);
        if (context.PISS_COUNT > 10) {
          console.log("ololol g fe pipi");
          return { PISS_COUNT: 0 };
        }
        return { PISS_COUNT: context.PISS_COUNT + 1 };
      }),
      removeThirst: (context, event) => {},
      addAnger: (context, event) => {},
    },
    services: {},
    guards: {
      THIRST_NOT_FULL: (context, event) => true,
      HAS_ACTION: (context, event) => true,
      ACTION_DRINK: (context, event) => true,
      ACTION_PISS: (context, event) => false,
      THRIST_NOT_EMPTY: (context, event) => false,
      THIRST_EMPTY: (context, event) => false,
      ANGER_NOT_FULL: (context, event) => false,
      ANGER_FULL: (context, event) => false,
      THIRST_FULL: (context, event) => false,
    },
    delays: {},
  }
);
