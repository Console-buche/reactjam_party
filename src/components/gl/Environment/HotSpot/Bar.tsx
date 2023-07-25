import { useInterpret, useSelector } from '@xstate/react';
import { barMachine } from '../../../../machines/bar.machine';
import { useStoreDragging } from '../../../../stores/storeDragging';
import { Hotspot } from './Hotspot';

export const Bar = () => {
  const service = useInterpret(barMachine);
  const maxPersons = useSelector(service, (s) => s.context.maxPersons);
  const draggingActorRef = useStoreDragging((state) => state.draggingActorRef);

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
