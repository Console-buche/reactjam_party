import './clock.css';

type Props = {
  elapsedPercent: number;
  maxTime: number;
  elapsedTime: number;
};

function formatSecondsToMinutesAndSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export const Clock = ({ elapsedPercent, elapsedTime, maxTime }: Props) => {

  return (
    <div className="gameMeter__container">
      <div className="relative">
        <img
          src="./assets/hud/clock.png"
          alt="meter"
          style={{ filter: `grayscale(1)` }}
        />
        <div className="gameMeter__timeLeft">
          {formatSecondsToMinutesAndSeconds(maxTime - elapsedTime)}
        </div>
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
