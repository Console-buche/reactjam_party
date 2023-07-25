import { useInterpret, useSelector } from '@xstate/react';
import { toiletMachine } from '../../../../machines/toilet.machine';
import { useStoreDragging } from '../../../../stores/storeDragging';
import { Hotspot } from './Hotspot';

export const Toilet = () => {
  const service = useInterpret(toiletMachine);
  const maxPersons = useSelector(service, (s) => s.context.maxPersons);
  const draggingActorRef = useStoreDragging((state) => state.draggingActorRef);

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
