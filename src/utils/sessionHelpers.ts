import { STORAGE_KEYS } from './constants';

export const logout = () => {
  window.localStorage.removeItem(STORAGE_KEYS.APP);
  window.localStorage.removeItem(STORAGE_KEYS.VERIFY);
  window.sessionStorage.removeItem(STORAGE_KEYS.SESSION);
};
