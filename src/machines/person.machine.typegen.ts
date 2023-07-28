// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
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
    updateNeeds: 'xstate.after(500)#Person.meterFlow.Active';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | 'actionFlow'
    | 'actionFlow.Drinking'
    | 'actionFlow.Idle'
    | 'actionFlow.Pissing'
    | 'meterFlow'
    | 'meterFlow.Active'
    | 'meterFlow.Inactive'
    | {
        actionFlow?: 'Drinking' | 'Idle' | 'Pissing';
        meterFlow?: 'Active' | 'Inactive';
      };
  tags: never;
}
