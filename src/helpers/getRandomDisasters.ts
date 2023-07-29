import { MathUtils } from "three";

export const disasterNames = ['onBlackout', 'onPolice', 'onFire'];

export const generateRandomDisasters = (night: number) => {
  const getRandomDisasterName = () =>
    disasterNames[MathUtils.randInt(1, disasterNames.length)];

  const disasters = Array.from({ length: night + 1 }, () => ({
    time: MathUtils.randInt(3, length),
    disasterName: getRandomDisasterName(),
  }));

  disasters.sort((a, b) => a.time - b.time);
  return disasters;
};
