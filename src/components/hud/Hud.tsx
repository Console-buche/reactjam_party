import { useSelector } from '@xstate/react';
import { useState } from 'react';
import { useGameMachineProvider } from '../../hooks/use';
import { Advisor } from './Advisor/Advisor';
import { Clock } from './clock/Clock';
import { HotSpots } from './hotspots/HotSpots';

export const Hud = () => {
  const gameService = useGameMachineProvider();
  const timerPercent = useSelector(gameService, (state) => state.context.clock);

  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsClicked(!isClicked)}
        style={{ position: 'absolute', fontSize: '40px', bottom: 0 }}
      >
        Click me
      </button>
      <HotSpots />
      <Clock percent={timerPercent} />
      <Advisor isClicked={isClicked} />
    </>
  );
};
