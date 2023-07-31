import { useEffect } from 'react';
import { useGameMachineProvider } from '../../../hooks/use';
import Wad from 'web-audio-daw';
import { useSelector } from '@xstate/react';

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
  bar: new Wad({
    //@ts-ignore (it works, but the types are wrong)
    source: '/assets/sounds/bar.mp3',
    volume: 0.3,
  }),
  buffet: new Wad({
    //@ts-ignore (it works, but the types are wrong)
    source: '/assets/sounds/buffet.mp3',
    volume: 0.3,
    offset: 1.1,
  }),
  dancefloor: new Wad({
    //@ts-ignore (it works, but the types are wrong)
    source: '/assets/sounds/dancefloor.mp3',
    volume: 0.3,
  }),
  toilet: new Wad({
    //@ts-ignore (it works, but the types are wrong)
    source: '/assets/sounds/toilet.mp3',
    volume: 0.3,
  }),
  sofa: new Wad({
    //@ts-ignore (it works, but the types are wrong)
    source: '/assets/sounds/sofa.mp3',
    volume: 0.3,
  }),
} as const;

export const SoundEffect = () => {
  const gameService = useGameMachineProvider();
  const hotspots = useSelector(gameService, (state) => state.context.hotspots);

  useEffect(() => {
    Object.keys(hotspots).forEach((key) => {
      const currentHotspot = hotspots[key as keyof typeof hotspots];
      console.log(currentHotspot.id);
      currentHotspot.subscribe((state) => {
        // console.log(state.event.type, 'triggered');
        if (state.event.type !== 'onRegisterPerson') return;

        const name = currentHotspot.getSnapshot()?.context.name as
          | keyof typeof soundEffects
          | undefined;

        if (name === undefined) return;

        const currentSoundEffect = soundEffects[name];
        currentSoundEffect?.play();
      });
    });
  }, [hotspots]);

  useEffect(() => {
    gameService.subscribe((state) => {
      // console.log(state.event.type);
      if (!soundEffects[state.event.type as keyof typeof soundEffects]) return;
      console.log(state.event.type, 'triggered');
      const currentSoundEffect =
        soundEffects[state.event.type as keyof typeof soundEffects];

      currentSoundEffect.play();
    });
  }, [gameService]);

  return null;
};
