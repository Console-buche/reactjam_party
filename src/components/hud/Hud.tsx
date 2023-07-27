import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../hooks/use';
import { Clock } from './clock/Clock';
import { HotSpots } from './hotspots/HotSpots';

export const Hud = () => {
  const gameService = useGameMachineProvider();
  const timerPercent = useSelector(gameService, (state) => state.context.clock);
  console.log('timerPercent', timerPercent, Math.random());

  return (
    <>
      <HotSpots />
      <Clock percent={timerPercent} />
    </>
  );
};
