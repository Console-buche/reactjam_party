import { useMachine } from '@xstate/react';
import { button, useControls } from 'leva';
import { GameMachineProvider } from './hooks/use';
import { gameMachine } from './machines/game.machine';

import './style/App.css';
import { Scene } from './components/gl/Scene/Scene';

function App() {
  const [state, , service] = useMachine(gameMachine);
  const leva = useControls({
    'Display machines JSON': false,
    'Invite Person': button(() => service.send({ type: 'onAddPerson' })),
    'Remove Last Person': button(() =>
      service.send({ type: 'onRemoveLastPerson' }),
    ),
  });

  return (
    <GameMachineProvider value={service}>
      {leva['Display machines JSON'] && JSON.stringify(state.context)}
      {/* <Hud /> */}
      <Scene />
    </GameMachineProvider>
  );
}

export default App;
