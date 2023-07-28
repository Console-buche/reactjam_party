import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../hooks/use';
import { Clock } from './clock/Clock';
import { HotSpots } from './hotspots/HotSpots';
import { Advisor } from './Advisor/Advisor';
import { useState } from 'react';

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
