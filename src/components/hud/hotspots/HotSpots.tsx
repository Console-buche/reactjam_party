import { hotspots } from '../../../stores/storeHotspots';
import './hotspots.css';

export const HotSpots = () => {
  return (
    <div className="hotspots__container">
      {hotspots.map((hotspot) => (
        <div className="hotspots__card" key={hotspot}>
          <div>{hotspot}</div>
          <div className="hotspots__card__metric"> 1/3</div>
        </div>
      ))}
    </div>
  );
};
