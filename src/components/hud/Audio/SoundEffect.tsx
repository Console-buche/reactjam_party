import { useEffect } from 'react';
import { useGameMachineProvider } from '../../../hooks/use';
import Wad from 'web-audio-daw';

const soundEffects = {
  onAddPerson: new Wad({
    //@ts-ignore (it works, but the types are wrong)
    source: '/assets/sounds/onAddPerson.mp3',
    volume: 0.1,
  }),
  onRemovePerson: new Wad({
    //@ts-ignore (it works, but the types are wrong)
    source: '/assets/sounds/onRemovePerson.mp3',
    volume: 0.3,
  }),
} as const;

export const SoundEffect = () => {
  const gameService = useGameMachineProvider();

  useEffect(() => {
    gameService.subscribe((state) => {
      if (!soundEffects[state.event.type as keyof typeof soundEffects]) return;
      console.log(state.event.type, 'triggered');
      const currentSoundEffect =
        soundEffects[state.event.type as keyof typeof soundEffects];

      currentSoundEffect.play();
    });
  }, [gameService]);
  return null;
};
