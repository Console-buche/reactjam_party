import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../../hooks/use';
import { hotspots, useStoreHotspot } from '../../../stores/storeHotspots';
import './hotspots.css';
import { useStoreCam } from '../../../stores/storeCam';
import { Vector3 } from 'three';

export const HotSpots = () => {
  const gameService = useGameMachineProvider();
  const hotspotsServices = useSelector(
    gameService,
    (state) => state.context.hotspots,
  );
  const bar = useSelector(hotspotsServices.bar, (state) => state.context);
  const toilet = useSelector(hotspotsServices.toilet, (state) => state.context);
  const cameraControls = useStoreCam((state) => state.controls);
  const hotspotWithPositions = useStoreHotspot((state) => state.hotspots);

  const getStats = (hotSpot: (typeof hotspots)[number]) => {
    switch (hotSpot) {
      case 'bar':
        return bar.persons.length;
      case 'toilet':
        return toilet.persons.length;
      default:
        return 0;
    }
  };

  return (
    <div className="hotspots__container">
      {hotspots.map((hotspot) => (
        <div
          className="hotspots__card"
          key={hotspot}
          onClick={() => {
            const pos = hotspotWithPositions[hotspot].position.clone();
            cameraControls?.setLookAt(
              ...new Vector3(pos.x, 4, 23).toArray(),
              ...pos
                .clone()
                .add(new Vector3(0, 2, -1))
                .toArray(),
              true,
            );
          }} // TODO :
        >
          <img
            src={`./assets/hud/button_${hotspot}.png`}
            alt="hotspot"
            style={{ objectFit: 'contain', width: '100%' }}
          />
          <div className="hotspots__card__stats">{getStats(hotspot)}</div>
        </div>
      ))}
    </div>
  );
};
