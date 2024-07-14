import { atom, selector, } from 'recoil';
import {AuthResponse,} from '../lib/interfaces'

const localStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    try {
      // Try to parse, but if it fails, use the raw string value
      setSelf(JSON.parse(savedValue));
    } catch (error) {
      setSelf(savedValue);
    }
  }

  onSet((newValue: any, _: any, isReset: boolean) => {
    if (isReset) {
      localStorage.removeItem(key);
    } else {
      try {
        // If it's an object, stringify it. Otherwise, store it as-is.
        const valueToStore = typeof newValue === 'object' ? JSON.stringify(newValue) : newValue;
        localStorage.setItem(key, valueToStore);
      } catch (error) {
        console.error(`Error storing value in localStorage for key "${key}":`, error);
      }
    }
  });
};

export const userState = atom<AuthResponse['user'] | null>({
  key: 'userState',
  default: null,
  effects: [localStorageEffect('user')],
});

export const tokenState = atom<string | null>({
  key: 'tokenState',
  default: null,
  effects: [localStorageEffect('access_token')],
});

export const isAuthenticatedState = selector({
  key: 'isAuthenticatedState',
  get: ({ get }) => {
    const user = get(userState);
    const token = get(tokenState);
    // const isAuthenticated = true;
    return !!user && !!token ;
  },
});
