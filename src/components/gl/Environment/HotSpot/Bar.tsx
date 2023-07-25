import { useInterpret, useSelector } from '@xstate/react';
import { useContext } from 'react';
import { barMachine } from '../../../../machines/bar.machine';
import { DraggingContext } from '../../World/World';
import { Hotspot } from './Hotspot';

export const Bar = () => {
  const service = useInterpret(barMachine);
  const maxPersons = useSelector(service, (s) => s.context.maxPersons);
  const { draggingActorRef } = useContext(DraggingContext); //TODO: degager ce contexte de mort XD

  return (
    <Hotspot
      slotsAmount={maxPersons}
      position={[-6, 0, -7]}
      onDropHotspot={() =>
        draggingActorRef &&
        service.send({ type: 'onAddPerson', person: draggingActorRef })
      }
    />
  );
};
