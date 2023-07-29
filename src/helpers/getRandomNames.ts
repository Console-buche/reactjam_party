import { MathUtils } from 'three';

const names = [
  'Simbala',
  'Plumbob',
  'Llamanade',
  'Gibberish',
  'Wuhoo',
  'BellaGoth',
  'Simoleon',
  'Woohookie',
  'Simberly',
  'Llamalette',
  'Whippna',
  'Simmette',
  'BobNewbie',
  'Zigaloo',
  'SulSul',
  'Freetushi',
  'Vadish',
  'Retgirb',
  'Blahort',
  'Graaable',
];

export const getRandomName = () =>
  names[MathUtils.randInt(0, names.length - 1)];
