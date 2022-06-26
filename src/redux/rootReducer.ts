import { combineReducers } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { persistReducer } from 'redux-persist';
import persistStorage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import appReducer from '../app/appSlice';
import homeReducer from '../home/homeSlice';

const storage = Platform.OS === 'web' ? persistStorage : AsyncStorage;

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['home'],
};

const appPersistConfig = {
  key: 'app',
  version: 1,
  storage,
  whitelist: ['appKey', 'verifyKey'],
};

const rootReducer = combineReducers({
  app: persistReducer(appPersistConfig, appReducer),
  home: homeReducer,
});

export default persistReducer(persistConfig, rootReducer);
