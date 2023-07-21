import { InterpreterFrom } from "xstate";
import { createContextWithHook } from "../context/machineContext";
import { personMachine } from "../machines/person.machine";

export const [GameMachineProvider, useGameMachineProvider] =
  createContextWithHook<InterpreterFrom<typeof personMachine>>(
    "GameMachineContext"
  );
