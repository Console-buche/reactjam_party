import { useSelector } from '@xstate/react';
import { useState } from 'react';
import { useGameMachineProvider } from '../../hooks/use';
import { Advisor } from './Advisor/Advisor';
import { GameMeter } from './GameMeter/GameMeter';
import { HotSpots } from './Hotspots/HotSpots';
import { Audio } from './Audio/Audio';

export const Hud = () => {
  const gameService = useGameMachineProvider();
  const timerPercent = useSelector(gameService, (state) => state.context.clock);
  const hype = useSelector(gameService, (state) => state.context.meters.hype);

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
      <GameMeter elapsedPercent={timerPercent} hypeValue={hype} />
      <Audio />
      <Advisor isClicked={isClicked} />
    </>
  );
};
