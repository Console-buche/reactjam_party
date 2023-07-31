import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../../hooks/use';
import './score.css';
export const Score = () => {
  const gameService = useGameMachineProvider();
  const meters = useSelector(gameService, (state) => state.context.meters);

  return (
    <div className="score">
      <div className="score__value">max hype generated: {meters.maxHype}</div>
      <div className="score__value">max guests: {meters.maxPersons}</div>
      <div className="score__value">current hype: {meters.hype}</div>
    </div>
  );
};
