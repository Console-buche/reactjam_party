import type { Group } from 'three';
import type { ActorRefFrom } from 'xstate';
import { create } from 'zustand';
import type { personMachine } from '../machines/person.machine';

type InitialState = {
  isHoveringPerson: boolean;
  isDragging: boolean;
  draggingId: string | null;
  draggingActorRef: ActorRefFrom<typeof personMachine> | null;
  draggingRef: Group | null;
};

type Actions = {
  setIsDragging: (isDragging: boolean) => void;
  setDraggingId: (draggingId: string | null) => void;
  setDraggingRef: (draggingRef: Group | null) => void;
  setDraggingActorRef: (
    draggingActorRef: ActorRefFrom<typeof personMachine> | null,
  ) => void;
  setIsHoveringPerson: (isHoveringPerson: boolean) => void;
};

const InitialState = {
  isDragging: false,
  draggingId: null,
  isHoveringPerson: false,
  draggingRef: null,
  draggingActorRef: null,
};

export const useStoreDragging = create<InitialState & Actions>((set) => ({
  ...InitialState,

  setIsDragging: (isDragging) => set({ isDragging }),

  setDraggingId: (draggingId) => set({ draggingId }),

  setDraggingRef: (draggingRef) => set({ draggingRef }),

  setDraggingActorRef: (draggingActorRef) => set({ draggingActorRef }),

  setIsHoveringPerson: (isHoveringPerson) => set({ isHoveringPerson }),
}));
