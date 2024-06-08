import { Role } from '@/enums/role';
import { StoreApi, create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';

type User = {
  id: string | null;
  role: keyof typeof Role | null;
};

type UserStoreProps = {
  user: User;
  setUser: (data: User) => void;
  clearUser: () => void;
};

const userStore = (set: StoreApi<UserStoreProps>['setState']): UserStoreProps => ({
  user: {
    id: null,
    role: null,
  },
  setUser: (data: User) =>
    set(() => ({
      user: {
        id: data.id,
        role: data.role,
      },
    })),
  clearUser: () =>
    set(() => ({
      user: {
        id: null,
        role: null,
      },
    })),
});

export const useUserStore = create(
  persist(userStore, { name: '@pontoja:app', storage: createJSONStorage(() => storage) }),
);
