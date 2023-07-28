import { useMachine } from '@xstate/react';
import { button, useControls } from 'leva';
import { GameMachineProvider } from './hooks/use';
import { gameMachine } from './machines/game.machine';

import './style/App.css';
import { Scene } from './components/gl/Scene/Scene';
import { Hud } from './components/hud/Hud';

function App() {
  const [state, , service] = useMachine(gameMachine);
  const leva = useControls({
    'Display machines JSON': false,
    'Invite Person': button(() => service.send({ type: 'onAddPerson' })),
    Start: button(() => service.send({ type: 'onStart' })),
    Pause: button(() => service.send({ type: 'onPause' })),
    'End Game': button(() => service.send({ type: 'onGameOver' })),
  });

  return (
    <GameMachineProvider value={service}>
      {leva['Display machines JSON'] && JSON.stringify(state.context)}
      <Scene />
      <Hud />
    </GameMachineProvider>
  );
}

export default App;
