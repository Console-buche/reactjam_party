import { MathUtils } from 'three';

const names = [
  'SimberlyAndWuhoo',
  'BellaGoth',
  'Llamanade',
  'Woohookie',
  'Simmette',
  'SulSul',
  'Zigaloo',
  'Dancemachine',
  'Vadish',
];

export const getRandomName = () =>
  names[MathUtils.randInt(0, names.length - 1)];
