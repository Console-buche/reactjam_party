import { useGameMachineProvider } from '../../../hooks/use';
import { useSelector } from '@xstate/react';
import { Score } from '../Score/Score';

const githubItem = {
  name: 'Github',
  action: () =>
    window.open('https://github.com/Console-buche/reactjam_party', '_blank'),
};

export const useMenuItems = () => {
  const gameService = useGameMachineProvider();
  const state = useSelector(gameService, (state) => state.value);
  const lostReason = useSelector(
    gameService,
    (state) => state.context.lostReason,
  );

  const howToPlayItem = {
    name: 'How to play',
    action: () => gameService.send('onHowToPlay'),
  };

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
    howToPlay: {
      image: './assets/hud/how_to_play.png',
      menuItemOffset: '1%',
      prependElements: null,
      items: [
        {
          name: 'Back to Menu',
          action: () => gameService.send('onPause'),
        },
      ],
    },
    finished: {
      image: './assets/hud/empty_menu.png',
      menuItemOffset: '40%',
      prependElements: (
        <div className="center recap__endgame">
          <Score />
          <hr />
          <div className="menu__title red">Game Over</div>
          <div className="red">{lostReason}</div>
        </div>
      ),
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
