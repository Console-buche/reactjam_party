import { useMachine } from '@xstate/react';
import { button, useControls } from 'leva';
import { GameMachineProvider } from './hooks/use';
import { gameMachine } from './machines/game.machine';
import './style/App.css';
import { Hud } from './components/hud/Hud';
import { Scene } from './components/gl/Scene';

function App() {
  const [state, _, service] = useMachine(gameMachine);
  const leva = useControls({
    'Display machines JSON': false,
    'Add Person': button(() => service.send({ type: 'onAddPerson' })),
    'Remove Person': button(() =>
      service.send({ type: 'onRemovePerson', id: '1' }),
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
