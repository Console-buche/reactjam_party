// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    '': { type: '' };
    'xstate.after(1000)#Person.actionFlow.Doing.Drinking': {
      type: 'xstate.after(1000)#Person.actionFlow.Doing.Drinking';
    };
    'xstate.after(1000)#Person.actionFlow.Doing.Pissing': {
      type: 'xstate.after(1000)#Person.actionFlow.Doing.Pissing';
    };
    'xstate.after(1000)#Person.actionFlow.Resting.Idle': {
      type: 'xstate.after(1000)#Person.actionFlow.Resting.Idle';
    };
    'xstate.after(500)#Person.meterFlow.Active': {
      type: 'xstate.after(500)#Person.meterFlow.Active';
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
      | 'xstate.after(1000)#Person.actionFlow.Doing.Drinking'
      | 'xstate.after(1000)#Person.actionFlow.Resting.Idle';
    drink: 'xstate.after(1000)#Person.actionFlow.Doing.Drinking';
    emptyPee: 'xstate.after(1000)#Person.actionFlow.Doing.Drinking';
    increaseHype: 'xstate.after(1000)#Person.actionFlow.Doing.Drinking';
    pee: 'xstate.after(1000)#Person.actionFlow.Doing.Pissing';
    registerHotspot: 'onRegisterHotspot';
    unregisterHotspot: 'onUnregisterHotspot';
    updateNeeds: 'xstate.after(500)#Person.meterFlow.Active';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    canPee: 'xstate.after(1000)#Person.actionFlow.Doing.Pissing';
    isActionDrink: 'onDrop';
    isActionPiss: 'onDrop';
    isPeeEmpty: 'xstate.after(1000)#Person.actionFlow.Doing.Pissing';
    isPeeFull: 'xstate.after(1000)#Person.actionFlow.Doing.Drinking';
    isThirsty: 'xstate.after(1000)#Person.actionFlow.Doing.Drinking';
  };
  eventsCausingServices: {};
  matchesStates:
    | 'actionFlow'
    | 'actionFlow.Blocking'
    | 'actionFlow.Blocking.PissingHimself'
    | 'actionFlow.Doing'
    | 'actionFlow.Doing.Drinking'
    | 'actionFlow.Doing.Pissing'
    | 'actionFlow.Resting'
    | 'actionFlow.Resting.Dragging'
    | 'actionFlow.Resting.Idle'
    | 'meterFlow'
    | 'meterFlow.Active'
    | 'meterFlow.Inactive'
    | {
        actionFlow?:
          | 'Blocking'
          | 'Doing'
          | 'Resting'
          | {
              Blocking?: 'PissingHimself';
              Doing?: 'Drinking' | 'Pissing';
              Resting?: 'Dragging' | 'Idle';
            };
        meterFlow?: 'Active' | 'Inactive';
      };
  tags: never;
}
