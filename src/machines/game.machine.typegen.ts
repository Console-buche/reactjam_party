// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.after(500)#Game.playing': {
      type: 'xstate.after(500)#Game.playing';
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
    addHotspot: 'onAddHotspot';
    addPerson: 'onAddPerson';
    endNight: 'onEndNight' | 'xstate.after(500)#Game.playing';
    removeHotspot: 'onRemoveHotspot';
    removePerson: 'onRemovePerson';
    tick: 'xstate.after(500)#Game.playing';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates: 'finished' | 'notStarted' | 'paused' | 'playing';
  tags: never;
}
