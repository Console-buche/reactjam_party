import { Vector3 } from 'three';
import { StrictObject } from '../../../helpers/strictObject';
import type { METERS_CONFIG } from '../../../machines/person.machine';
import { Statbar } from './Statbar';

type StatWithPosition = {
  value: number;
  offsetX?: number;
  offsetY?: number;
};

type Stat = Record<keyof typeof METERS_CONFIG, StatWithPosition>;

type Statbars = {
  values: Stat;
};

export const Statbars = ({ values }: Statbars) => {
  return (
    <group>
      {StrictObject.entries(values).map(
        ([key, { offsetX, offsetY = 0, value }]) => {
          return (
            <Statbar
              key={key}
              statName={key}
              value={value}
              position={new Vector3(0, 4.75, 0)}
              position-x={offsetX}
              position-y={4.75 + offsetY}
            />
          );
        },
      )}
    </group>
  );
};
