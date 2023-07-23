import { Grid } from '@react-three/drei';

// USE for testing only
export const Floor = () => {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: '#6f6f6f',
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: '#9d4b4b',
    fadeDistance: 500,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };
  return <Grid position={[0, -2, 0]} args={[100.5, 100.5]} {...gridConfig} />;
};
