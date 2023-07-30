import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../hooks/use';
import { Advisor } from './Advisor/Advisor';
import { GameMeter } from './GameMeter/GameMeter';
import { HotSpots } from './Hotspots/HotSpots';
import { Audio } from './Audio/Audio';
import { Menu } from './Menu/Menu';

export const Hud = () => {
  const gameService = useGameMachineProvider();
  const state = useSelector(gameService, (state) => state.value);
  const timerPercent = useSelector(gameService, (state) => state.context.clock);
  const hype = useSelector(gameService, (state) => state.context.meters.hype);
  const guideText = useSelector(
    gameService,
    (state) => state.context.guideText,
  );

  return (
    <>
      <HotSpots />
      <GameMeter elapsedPercent={timerPercent} hypeValue={hype} />
      <Audio />
      <Advisor
        text={guideText}
        onSkipText={() => {
          console.log('skip text');
        }}
      />
      {state !== 'playing' && <Menu />}
    </>
  );
};
