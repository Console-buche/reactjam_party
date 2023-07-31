import { useSelector } from '@xstate/react';
import { useGameMachineProvider } from '../../../hooks/use';
import { useRef } from 'react';
import './audio.css';

export const Audio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const gameService = useGameMachineProvider();
  const state = useSelector(gameService, (state) => state.value);

  if (audioRef.current && audioRef.current.volume !== 0.1)
    audioRef.current.volume = 0.1;

  if (state === 'playing') audioRef.current?.play();
  if (state === 'paused') audioRef.current?.pause();

  const hiddenClass =
    state === 'playing' || state === 'notStarted' || state === 'howToPlay'
      ? 'audio__hidden'
      : '';

  return (
    <div className="audio__container">
      <audio
        ref={audioRef}
        className={`"audio__player" ${hiddenClass}`}
        controls
        loop
      >
        <source
          src="/assets/sounds/Snifit-or-Whiffit-PaperMario-Color-Splash.mp3"
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
};
