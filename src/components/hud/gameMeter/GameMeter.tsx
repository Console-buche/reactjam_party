import './gameMeter.css';

type Props = {
  hypeValue: number;
  elapsedPercent: number;
};

export const GameMeter = ({ elapsedPercent, hypeValue }: Props) => {
  return (
    <div className="gameMeter__container">
      <div className="gameMeter__overlay backgroundImage"></div>
      <div
        className="gameMeter__image backgroundImage"
        style={{ clipPath: `inset(0 ${100 - elapsedPercent}% 0 0)` }}
      />
      <div className="gameMeter__text">{hypeValue}</div>
    </div>
  );
};
