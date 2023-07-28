// Use this store to get 3D positions and UI related stuff

import { CameraControls } from '@react-three/drei';
import { create } from 'zustand';

type InitialState = {
  controls: CameraControls | null;
};

type Actions = {
  registerControls: (controls: CameraControls) => void;
};

const InitialState: InitialState = {
  controls: null,
};

export const useStoreCam = create<InitialState & Actions>((set) => ({
  ...InitialState,

  registerControls(controls) {
    set(() => ({
      controls,
    }));
  },
}));
