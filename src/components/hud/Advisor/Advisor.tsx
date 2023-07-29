import { animated, easings, useSpring } from 'react-spring';
import './advisor.css';

type Props = {
  text: string;
  onSkipText: () => void;
};
export const Advisor = ({ text, onSkipText }: Props) => {
  const isOpen = text.length > 0;

  const { slideIn, opacity } = useSpring({
    slideIn: isOpen ? 0 : -30,
    faceSlideIn: isOpen ? 0 : 60,
    opacity: isOpen ? 0.9 : 0,
    easing: easings.easeInOutSine,
  });

  return (
    <div className="advisor__container" onClick={onSkipText}>
      <div
        style={{ position: 'relative', width: '500px', objectFit: 'contain' }}
      >
        <animated.img
          className="advisor__face"
          alt="advisor"
          src="./assets/hud/advisor_face_1.png"
          style={{
            opacity,
            bottom: slideIn,
          }}
        />
      </div>
      <div style={{ position: 'relative', width: '500px' }}>
        <div className="advisor__speech">
          <animated.img
            className="advisor__speech__bubble"
            alt="advisor"
            src="./assets/hud/bubble.png"
            style={{
              opacity,
              top: slideIn,
            }}
          />
          <animated.div className="advisor__speech__text" style={{ opacity }}>
            {text}
          </animated.div>
        </div>
      </div>
    </div>
  );
};
