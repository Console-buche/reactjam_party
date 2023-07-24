import type { ActorRefFrom, InterpreterFrom } from 'xstate';
import { createContextWithHook } from '../context/machineContext';
import { personMachine } from '../machines/person.machine';
import { gameMachine } from '../machines/game.machine';

export const [PersonMachineProvider, usePersonMachineProvider] =
  createContextWithHook<InterpreterFrom<typeof personMachine>>(
    'PersonMarchineContext',
  );

export const [GameMachineProvider, useGameMachineProvider] =
  createContextWithHook<ActorRefFrom<typeof gameMachine>>('GameMachineContext');
