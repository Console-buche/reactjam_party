import { clamp } from 'three/src/math/MathUtils';
import './hypegauge.css';

const hypeToDegree = (hype: number) => clamp(hype * 0.3 - 230, -220, 40);

type Props = {
  hype: number;
};

const getImageNameFromHype = (hype: number) => {
  if (hypeToDegree(hype) <= -127) return 'lame';
  if (hypeToDegree(hype) < 40) return 'fun';
  return 'overload';
};

export const HypeGauge = ({ hype }: Props) => {
  const shake =
    hypeToDegree(hype) <= -127
      ? ''
      : hypeToDegree(hype) < 40
      ? 'light-shake'
      : 'hard-shake';

  return (
    <div className={`hype__gauge__container ${shake}`}>
      <img
        src={`/assets/hud/gauge_${getImageNameFromHype(hype)}.png`}
        alt="hype gauge meter"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 326 226"
        className="hype__gauge__needle"
        style={{ transform: `rotate(${hypeToDegree(hype)}deg)` }}
      >
        <g transform="matrix(0.997203,-0.074735,0.074735,0.997203,-14.709784,12.898991)">
          <path
            d="M291 203 L 165 193 165 213Z"
            stroke="#c20000"
            strokeWidth="0.5"
            fill="#c20000"
          ></path>
          <circle
            cx="165"
            cy="203"
            r="20"
            stroke="#c20000"
            fill="#c20000"
          ></circle>
        </g>
      </svg>
    </div>
  );
};
