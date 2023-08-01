import './clock.css';

type Props = {
  elapsedPercent: number;
};

export const Clock = ({ elapsedPercent }: Props) => {
  return (
    <div className="gameMeter__container">
      <div className="relative">
        <img
          src="./assets/hud/clock.png"
          alt="meter"
          style={{ filter: `grayscale(1)` }}
        />
        <img
          src="./assets/hud/clock.png"
          alt="meter"
          className="absolute"
          style={{ clipPath: `inset(0 ${100 - elapsedPercent}% 0 0)` }}
        />
      </div>
    </div>
  );
};
