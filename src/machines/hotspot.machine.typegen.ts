
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    "xstate.after(500)#Hotspot.Ticking": { type: "xstate.after(500)#Hotspot.Ticking" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {

  };
  missingImplementations: {
    actions: "updatePersons";
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    "updateHype": "xstate.after(500)#Hotspot.Ticking";
    "updatePersons": "xstate.after(500)#Hotspot.Ticking";
  };
  eventsCausingDelays: {

  };
  eventsCausingGuards: {

  };
  eventsCausingServices: {

  };
  matchesStates: "Ticking";
  tags: never;
}
