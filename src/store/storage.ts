import { StateStorage } from 'zustand/middleware';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export const storage: StateStorage = {
  getItem: async (name: string) => {
    return getCookie(name) ?? null;
  },
  setItem: async (name: string, value: string) => {
    setCookie(name, value);
  },
  removeItem: async (name: string) => {
    deleteCookie(name);
  },
};
