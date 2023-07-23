// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.after(1000)#Hotspot.UpdatingPersons': {
      type: 'xstate.after(1000)#Hotspot.UpdatingPersons';
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
    addPerson: 'onAddPerson';
    removePerson: 'onRemovePerson';
    updatePersons: 'onUpdatePerson';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    canAddPerson: 'onAddPerson';
    canRemovePerson: 'onRemovePerson';
  };
  eventsCausingServices: {};
  matchesStates: 'UpdatingPersons';
  tags: never;
}
