import { animated, easings, useSpring } from 'react-spring';
import './advisor.css';

export const Advisor = ({ isClicked }: { isClicked: boolean }) => {
  const { slideIn, opacity } = useSpring({
    slideIn: isClicked ? 0 : 30,
    faceSlideIn: isClicked ? 0 : 60,
    opacity: isClicked ? 1 : 0,
    easing: easings.easeInOutSine,
  });

  return (
    <div className="advisor__container">
      <animated.img
        className="advisor__face"
        alt="advisor"
        src="./assets/hud/advisor_face_1.png"
        style={{
          opacity,
          top: slideIn,
        }}
      />
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
          Hi ! Welcome to ... Hi ! Welcome to ...Hi ! Welcome to ...Hi ! Welcome
          to ...Hi ! Welcome to ...
        </animated.div>
      </div>
    </div>
  );
};
