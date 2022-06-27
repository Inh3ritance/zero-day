import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '../redux/store';

interface HomeState {
  socketNumber: string;
  selectedChat: string;
}

const initialState: HomeState = {
  socketNumber: '',
  selectedChat: 'public',
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setSocketNumber: (state, action: PayloadAction<string>) => {
      state.socketNumber = action.payload;
    },
    setSelectedChat: (state, action: PayloadAction<string>) => {
      state.selectedChat = action.payload;
    },
  },
});

export const homeActions = homeSlice.actions;

const socketNumberSelector = (state: RootState) => state.home.socketNumber;
const selectedChatSelector = (state: RootState) => state.home.selectedChat;

export const homeSelectors = {
  socketNumberSelector,
  selectedChatSelector,
};

export default homeSlice.reducer;
