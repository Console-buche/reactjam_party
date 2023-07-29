import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../hooks/use';
import { Advisor } from './Advisor/Advisor';
import { GameMeter } from './GameMeter/GameMeter';
import { HotSpots } from './Hotspots/HotSpots';
import { Audio } from './Audio/Audio';

export const Hud = () => {
  const gameService = useGameMachineProvider();
  const timerPercent = useSelector(gameService, (state) => state.context.clock);
  const hype = useSelector(gameService, (state) => state.context.meters.hype);

  return (
    <div className="hud__container">
      <HotSpots />
      <GameMeter elapsedPercent={timerPercent} hypeValue={hype} />
      <Audio />
      <Advisor
        text={'hello'}
        onSkipText={() => {
          console.log('skip text');
        }}
      />
    </div>
  );
};
