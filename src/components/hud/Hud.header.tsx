import { useSelector } from '@xstate/react';
import { HypeGauge } from './HypeGauge/HypeGauge';
import './hud.css';
import { useGameMachineProvider } from '../../hooks/use';
import { HotSpots } from './Hotspots/HotSpots';

export const HudHeader = () => {
  const gameService = useGameMachineProvider();
  const hype = useSelector(gameService, (state) => state.context.meters.hype);

  return (
    <div className="header__container">
      <HypeGauge hype={hype} />
      <HotSpots />
    </div>
  );
};
