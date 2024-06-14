import { StoreApi, create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';

type FidelityProgram = {
  id: string | null;
};

type FidelityProgramStoreProps = {
  fidelityProgram: FidelityProgram;
  setFidelityProgram: (data: FidelityProgram) => void;
  clearFidelityProgram: () => void;
};

const fidelityProgramStore = (
  set: StoreApi<FidelityProgramStoreProps>['setState'],
): FidelityProgramStoreProps => ({
  fidelityProgram: {
    id: null,
  },
  setFidelityProgram: (data: FidelityProgram) =>
    set(() => ({
      fidelityProgram: {
        id: data.id,
      },
    })),
  clearFidelityProgram: () =>
    set(() => ({
      fidelityProgram: {
        id: null,
      },
    })),
});

export const useFidelityProgramStore = create(
  persist(fidelityProgramStore, {
    name: '@pontoja:app.fidelity-program',
    storage: createJSONStorage(() => storage),
  }),
);
