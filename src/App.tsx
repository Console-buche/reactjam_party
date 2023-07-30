import { useMachine } from '@xstate/react';
import { button, useControls } from 'leva';
import { GameMachineProvider } from './hooks/use';
import { gameMachine } from './machines/game.machine';

import './style/App.css';
import { Scene } from './components/gl/Scene/Scene';
import { Hud } from './components/hud/Hud';
import { useEffect } from 'react';

function App() {
  const [state, , service] = useMachine(gameMachine, {
    devTools: true,
    id: 'GameService',
  });

  const leva = useControls({
    'Display machines JSON': false,
    'Invite Person': button(() => service.send({ type: 'onAddPerson' })),
    Start: button(() => service.send({ type: 'onStart' })),
    Pause: button(() => service.send({ type: 'onPause' })),
    'End Game': button(() => service.send({ type: 'onGameOver' })),
  });

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      console.log('User pressed: ', event.key);

      if (event.key === 'Escape') {
        event.preventDefault();
        service.getSnapshot().value === 'playing'
          ? service.send({ type: 'onPause' })
          : service.send({ type: 'onStart' });
      }
    };

    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [service]);

  return (
    <GameMachineProvider value={service}>
      {leva['Display machines JSON'] && JSON.stringify(state.context)}
      <Scene />
      <Hud />
    </GameMachineProvider>
  );
}

export default App;
