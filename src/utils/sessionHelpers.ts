import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

export const logout = async () => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.SESSION,
    STORAGE_KEYS.APP,
    STORAGE_KEYS.VERIFY,
  ]);
};
