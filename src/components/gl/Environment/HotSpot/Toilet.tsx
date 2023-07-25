import { useInterpret, useSelector } from '@xstate/react';
import { useContext } from 'react';
import { toiletMachine } from '../../../../machines/toilet.machine';
import { DraggingContext } from '../../World/World';
import { Hotspot } from './Hotspot';

export const Toilet = () => {
  const service = useInterpret(toiletMachine);
  const maxPersons = useSelector(service, (s) => s.context.maxPersons);
  const { draggingActorRef } = useContext(DraggingContext);

  console.log(draggingActorRef?.id);
  return (
    <Hotspot
      slotsAmount={maxPersons}
      position={[-6, 0, 7]}
      onDropHotspot={() => {
        draggingActorRef &&
          service.send({ type: 'onAddPerson', person: draggingActorRef });
      }}
    />
  );
};
