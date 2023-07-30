import { useGameMachineProvider } from "../../../hooks/use";
import { useSelector } from "@xstate/react";

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
      offsetY: 0,
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
      offsetY: 0,
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
      offsetY: 200,
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
}