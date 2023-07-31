import { useMachine } from '@xstate/react';
import { GameMachineProvider } from './hooks/use';
import { gameMachine } from './machines/game.machine';

import './style/App.css';
import { Scene } from './components/gl/Scene/Scene';
import { Hud } from './components/hud/Hud';
import { useEffect } from 'react';

function App() {
  const [, , service] = useMachine(gameMachine, {
    id: 'GameService',
  });

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      service.getSnapshot().value === 'playing'
        ? service.send({ type: 'onPause' })
        : service.send({ type: 'onStart' });
    };

    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [service]);

  return (
    <GameMachineProvider value={service}>
      <Scene />
      <Hud />
    </GameMachineProvider>
  );
}

export default App;
