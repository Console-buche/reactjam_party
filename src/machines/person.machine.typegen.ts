// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    '': { type: '' };
    'xstate.after(1000)#Person.Doing.Drinking': {
      type: 'xstate.after(1000)#Person.Doing.Drinking';
    };
    'xstate.after(1000)#Person.Doing.Pissing': {
      type: 'xstate.after(1000)#Person.Doing.Pissing';
    };
    'xstate.after(1000)#Person.Resting.Idle': {
      type: 'xstate.after(1000)#Person.Resting.Idle';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    decreaseHype:
      | 'xstate.after(1000)#Person.Doing.Drinking'
      | 'xstate.after(1000)#Person.Resting.Idle';
    drink: 'xstate.after(1000)#Person.Doing.Drinking';
    emptyPee: 'xstate.after(1000)#Person.Doing.Drinking';
    increaseHype: 'xstate.after(1000)#Person.Doing.Drinking';
    pee: 'xstate.after(1000)#Person.Doing.Pissing';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    canPee: 'xstate.after(1000)#Person.Doing.Pissing';
    isActionDrink: 'onDrop';
    isActionPiss: 'onDrop';
    isPeeEmpty: 'xstate.after(1000)#Person.Doing.Pissing';
    isPeeFull: 'xstate.after(1000)#Person.Doing.Drinking';
    isThirsty: 'xstate.after(1000)#Person.Doing.Drinking';
  };
  eventsCausingServices: {};
  matchesStates:
    | 'Blocking'
    | 'Blocking.PissingHimself'
    | 'Doing'
    | 'Doing.Drinking'
    | 'Doing.Pissing'
    | 'Resting'
    | 'Resting.Dragging'
    | 'Resting.Idle'
    | {
        Blocking?: 'PissingHimself';
        Doing?: 'Drinking' | 'Pissing';
        Resting?: 'Dragging' | 'Idle';
      };
  tags: never;
}
