import { useInterpret } from '@xstate/react';
import { barMachine } from '../../../../machines/bar.machine';
import { Hotspot } from './Hotspot';

export const Bar = () => {
  const service = useInterpret(barMachine);
  return <Hotspot type="battery" dropSpotQuality={5} position={[-6, 0, -7]} />;
};
