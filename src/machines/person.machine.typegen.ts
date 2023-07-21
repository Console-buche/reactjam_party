// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.after(1000)#Person.Angry": {
      type: "xstate.after(1000)#Person.Angry";
    };
    "xstate.after(1000)#Person.ThirstActions.Drinking": {
      type: "xstate.after(1000)#Person.ThirstActions.Drinking";
    };
    "xstate.after(1000)#Person.ThirstActions.Pissing": {
      type: "xstate.after(1000)#Person.ThirstActions.Pissing";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {
    ACTION_DRINK: "";
    ACTION_PISS: "";
    ANGER_FULL: "xstate.after(1000)#Person.Angry";
    ANGER_NOT_FULL: "xstate.after(1000)#Person.Angry";
    HAS_ACTION: "Dropped";
    THIRST_EMPTY: "xstate.after(1000)#Person.ThirstActions.Pissing";
    THIRST_FULL: "xstate.after(1000)#Person.ThirstActions.Drinking";
    THIRST_NOT_FULL: "xstate.after(1000)#Person.ThirstActions.Drinking";
    THRIST_NOT_EMPTY: "xstate.after(1000)#Person.ThirstActions.Pissing";
  };
  eventsCausingServices: {};
  matchesStates:
    | "Angry"
    | "Available"
    | "Available.Dragged"
    | "Available.Idle"
    | "Leaving"
    | "ThirstActions"
    | "ThirstActions.BeginAction"
    | "ThirstActions.Drinking"
    | "ThirstActions.Pissing"
    | "ThirstActions.PissingHimself"
    | {
        Available?: "Dragged" | "Idle";
        ThirstActions?:
          | "BeginAction"
          | "Drinking"
          | "Pissing"
          | "PissingHimself";
      };
  tags: never;
}
