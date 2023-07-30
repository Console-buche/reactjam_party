import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../../hooks/use';
import './menu.css';

export const Menu = () => {
  const gameService = useGameMachineProvider();
  const state = useSelector(gameService, (state) => state.value);

  const menuItems = [
    {
      name: state === 'notStarted' ? 'Start Game' : 'Resume',
      action: () => gameService.send('onStart'),
    },
    { name: 'How to play', action: () => console.log('how to play') },
    {
      name: 'Github',
      action: () =>
        window.open(
          'https://github.com/Console-buche/reactjam_party',
          '_blank',
        ),
    },
  ];

  return (
    <div className="menu__container">
      <div className="menu__absolute__wrapper">
        <img
          src="./assets/hud/menu.png"
          alt="invitation"
          className="menu__image"
        />
        <div className="menu__list">
          {menuItems.map((item) => (
            <div key={item.name} className="menu__item" onClick={item.action}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
