import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../hooks/use';
import { Clock } from './clock/Clock';

export const Hud = () => {
  const gameService = useGameMachineProvider();
  const timerPercent = useSelector(gameService, (state) => state.context.clock);
  console.log('timerPercent', timerPercent, Math.random());

  return (
    <>
      <Clock percent={timerPercent} />
    </>
  );
};
