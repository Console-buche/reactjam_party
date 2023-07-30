import { useGameMachineProvider } from '../../../hooks/use';
import { useSelector } from '@xstate/react';

const githubItem = {
  name: 'Github',
  action: () =>
    window.open('https://github.com/Console-buche/reactjam_party', '_blank'),
};

const howToPlayItem = {
  name: 'How to play',
  action: () => console.log('how to play'),
};

export const useMenuItems = () => {
  const gameService = useGameMachineProvider();
  const state = useSelector(gameService, (state) => state.value);

  const menuItemsByStates = {
    notStarted: {
      image: './assets/hud/menu.png',
      menuItemOffset: '75%',
      prependElements: null,
      items: [
        {
          name: 'Start Game',
          action: () => gameService.send('onStart'),
        },
        howToPlayItem,
        githubItem,
      ],
    },
    paused: {
      image: './assets/hud/menu.png',
      menuItemOffset: '75%',
      prependElements: null,
      items: [
        {
          name: 'Resume',
          action: () => gameService.send('onStart'),
        },
        howToPlayItem,
        githubItem,
      ],
    },
    finished: {
      image: './assets/hud/empty_menu.png',
      menuItemOffset: '90%',
      prependElements: <div className="menu__title">Game Over</div>,
      items: [
        {
          name: 'Restart',
          action: () => window.location.reload(),
        },
        howToPlayItem,
        githubItem,
      ],
    },
  };
  return menuItemsByStates[state as keyof typeof menuItemsByStates];
};