import { useInterpret } from '@xstate/react';
import { useContext } from 'react';
import { toiletMachine } from '../../../../machines/toilet.machine';
import { DraggingContext } from '../../World/World';
import { Hotspot } from './Hotspot';

export const Toilet = () => {
  const service = useInterpret(toiletMachine);
  const { draggingActorRef } = useContext(DraggingContext);
  return (
    <Hotspot
      type="battery"
      slotsAmount={5}
      position={[-6, 0, 7]}
      onDropHotspot={() =>
        draggingActorRef &&
        service.send({ type: 'onAddPerson', person: draggingActorRef })
      }
    />
  );
};
