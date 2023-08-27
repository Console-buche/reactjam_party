import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../../hooks/use';
import { hotspots, useStoreHotspot } from '../../../stores/storeHotspots';
import './hotspots.css';
import { useStoreCam } from '../../../stores/storeCam';
import { Vector3 } from 'three';

type HotSpotStatIcon = 'fun' | 'hydration' | 'satiety' | 'urine'

export const HotSpots = () => {
  const gameService = useGameMachineProvider();
  const hotspotsServices = useSelector(
    gameService,
    (state) => state.context.hotspots,
  );
  const bar = useSelector(hotspotsServices.bar, (state) => state.context);
  const toilet = useSelector(hotspotsServices.toilet, (state) => state.context);
  const buffet = useSelector(hotspotsServices.buffet, (state) => state.context);
  const dancefloor = useSelector(
    hotspotsServices.dancefloor,
    (state) => state.context,
  );
  const sofa = useSelector(hotspotsServices.sofa, (state) => state.context);
  const lobby = useSelector(hotspotsServices.lobby, (state) => state.context);
  const cameraControls = useStoreCam((state) => state.controls);
  const hotspotWithPositions = useStoreHotspot((state) => state.hotspots);


  const getIconFromHotspot = (hotSpot: (typeof hotspots)[number]): HotSpotStatIcon | null => {
    switch (hotSpot) {
      case 'bar':
        return 'hydration'
      case 'buffet':
        return 'satiety'
      case 'toilet':
        return 'urine'
      case 'dancefloor':
        return 'fun'
      default:
        return null
    }
  }

  const getStats = (hotSpot: (typeof hotspots)[number]) => {
    switch (hotSpot) {
      case 'bar':
        return bar.persons.length;
      case 'toilet':
        return toilet.persons.length;
      case 'buffet':
        return buffet.persons.length;
      case 'dancefloor':
        return dancefloor.persons.length;
      case 'sofa':
        return sofa.persons.length;
      case 'lobby':
        return lobby.persons.length;
      default:
        return 0;
    }
  };

  return (
    <>
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
          }}
        >

          <img
            src={`./assets/hud/button_${hotspot}.png`}
            alt="hotspot"
            style={{ objectFit: 'contain', width: '100%' }}
          />


          {getIconFromHotspot(hotspot) && <img
            src={`./assets/icons/${getIconFromHotspot(hotspot)}.png`}
            alt="hotspot"
            style={{ objectFit: 'contain', width: '40%', position: 'absolute', bottom: 10, left: 0 }}
          />
          }

          <div className="hotspots__card__stats">{getStats(hotspot)}</div>
        </div>
      ))}
    </>
  );
};
