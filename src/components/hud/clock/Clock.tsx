import './clock.css';

type Props = {
  percent: number;
};

export const Clock = ({ percent }: Props) => {
  return (
    <div className="clock__container">
      <div className="clock__overlay backgroundImage"></div>
      <div
        className="clock__image backgroundImage"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      ></div>
    </div>
  );
};
