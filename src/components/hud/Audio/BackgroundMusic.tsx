import { useSelector } from '@xstate/react';
import { useEffect, useRef, useState } from 'react';
import { useGameMachineProvider } from '../../../hooks/use';
import './backgroundMusic.css';

export const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const gameService = useGameMachineProvider();
  const state = useSelector(gameService, (state) => state.value);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current && audioRef.current.volume !== 0.1)
      audioRef.current.volume = 0.1;
  }, []);

  const playMusic = (play: boolean) => {
    if (!audioRef.current) return;

    if (play) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (state === 'playing') {
      playMusic(true);
    } else {
      playMusic(false);
    }
  }, [state]);

  const handleOnClick = () => {
    if (!audioRef.current) return;

    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} className="audio__player" controls loop>
        <source
          src="./assets/sounds/Snifit-or-Whiffit-PaperMario-Color-Splash.mp3"
          type="audio/mpeg"
        />
      </audio>
      <img
        src="./assets/icons/speaker.png"
        alt="audio icon"
        className={`audio__icon ${isPlaying ? 'audio__icon--playing' : ''}`}
        onClick={handleOnClick}
      />
    </>
  );
};
