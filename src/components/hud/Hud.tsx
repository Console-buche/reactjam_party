import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../hooks/use';
import { METERS_CONFIG } from '../../machines/game.machine';
import { Advisor } from './Advisor/Advisor';
import { Audio } from './Audio/Audio';
import { Clock } from './Clock/Clock';
import { HudHeader } from './Hud.header';
import { Menu } from './Menu/Menu';
import './hud.css';

export const Hud = () => {
  const gameService = useGameMachineProvider();
  const state = useSelector(gameService, (state) => state.value);
  const absoluteTimer = useSelector(
    gameService,
    (state) => state.context.clock,
  );
  const guideText = useSelector(
    gameService,
    (state) => state.context.guideText,
  );

  const timerPercent = (absoluteTimer / METERS_CONFIG.clock.maxValue) * 100;
  return (
    <>
      {state !== 'playing' && <div className="hud__faded" />}
      <Audio />
      <HudHeader />
      <Clock elapsedPercent={timerPercent} />
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
