
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "xstate.after(500)#Person.meterFlow.Active": { type: "xstate.after(500)#Person.meterFlow.Active" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "tickNeeds": "xstate.after(500)#Person.meterFlow.Active";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          
        };
        matchesStates: "actionFlow" | "actionFlow.Dancing" | "actionFlow.Drinking" | "actionFlow.Eating" | "actionFlow.Idle" | "actionFlow.Leaving" | "actionFlow.Pissing" | "actionFlow.Sitting" | "meterFlow" | "meterFlow.Active" | "meterFlow.Inactive" | { "actionFlow"?: "Dancing" | "Drinking" | "Eating" | "Idle" | "Leaving" | "Pissing" | "Sitting";
"meterFlow"?: "Active" | "Inactive"; };
        tags: never;
      }
  