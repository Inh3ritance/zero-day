import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import sha512 from 'crypto-js/sha512';
import { createUserRequest } from './api';
import { conformPlainText, rounds, xor } from '../crypto/utils';

import type { RootState } from '../redux/store';
import { CREATE_USER_ERROR } from '../login/constants';
import { VERIFY_REGEX } from '../utils/constants';

// Define a type for the slice state
interface AppState {
  appKey: string | null
  sessionKey: string | null;
  verifyKey: string | null;
  isLoggedIn: boolean;
}

// Define the initial state using that type
const initialState: AppState = {
  appKey: null,
  sessionKey: null,
  verifyKey: null,
  isLoggedIn: false,
};

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setAppKey: (state, action: PayloadAction<string | null>) => {
      // RTK handles immutability under the hood, and let's you treat state as mutable here
      state.appKey = action.payload;
    },
    setSessionKey: (state, action: PayloadAction<string | null>) => {
      state.sessionKey = action.payload;
    },
    setVerifyKey: (state, action: PayloadAction<string | null>) => {
      state.verifyKey = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    logout: (state) => {
      state.appKey = null;
      state.sessionKey = null;
      state.verifyKey = null;
      state.isLoggedIn = false;
    },
  },
});

const {
  setSessionKey, setAppKey, setVerifyKey, setIsLoggedIn, logout,
} = appSlice.actions;

const createUser = createAsyncThunk(
  'app/createUser',
  // if you type your function argument here
  async ({ username, keycode }: { username: string, keycode: string }, { dispatch }) => {
    const sessionKey = sha512(keycode).toString();

    let csrng = window.crypto.getRandomValues(new Uint32Array(1))[0].toString();
    const csrngHash = sha512(csrng).toString();

    const key = xor(csrngHash, sessionKey);
    const firstRound = rounds(csrngHash, 1); // our rounds are based off the unencrypeted csrng key

    csrng = window.crypto.getRandomValues(new Uint32Array(1))[0].toString();

    const verify = JSON.stringify({
      verify: true,
      username: `${username}#${csrng.substring(0, 5)}`, // visible rng
      csrng, // stored rng
    });

    const conformText = conformPlainText(verify); // make sure it is 128 chars. long
    const hashedUser = xor(firstRound, conformText);

    const { status } = await createUserRequest(username, csrng);
    if (status === 200) {
      dispatch(setAppKey(key));
      dispatch(setVerifyKey(hashedUser));
      dispatch(setSessionKey(sessionKey));
      dispatch(setIsLoggedIn(true));
    } else {
      // username taken
      console.warn(CREATE_USER_ERROR);
      dispatch(logout());
    }
  },
);

export const appActions = {
  ...appSlice.actions,
  createUser,
};

// Other code such as selectors can use the imported `RootState` type
const appKeySelector = (state: RootState) => state.app.appKey;
const sessionKeySelector = (state: RootState) => state.app.sessionKey;
const verifyKeySelector = (state: RootState) => state.app.verifyKey;
const isLoggedInSelector = createSelector(sessionKeySelector, (sessionKey) => !!sessionKey);

interface UserInfo {
  verify: boolean;
  username: string | null;
  csrng: string | null;
}

const userInfoSelector = createSelector(
  appKeySelector,
  sessionKeySelector,
  verifyKeySelector,
  (appKey, sessionKey, verifyKey) => {
    const key = xor(sessionKey || '', appKey || ''); // get unencrypted csrng key
    const firstRound = rounds(key, 1);
    let verify = xor(verifyKey || '', firstRound);
    verify = verify.replace(VERIFY_REGEX, '');
    try {
      const verifyObj: UserInfo = JSON.parse(verify || '{}');
      return {
        verify: true,
        username: verifyObj?.username as string || null,
        csrng: verifyObj?.csrng as string || null,
      };
    } catch (err) {
      console.error(err);
      return {
        verify: false,
        username: null,
        csrng: null,
      };
    }
  },
);

export const appSelectors = {
  appKeySelector,
  sessionKeySelector,
  verifyKeySelector,
  isLoggedInSelector,
  userInfoSelector,
};

export default appSlice.reducer;
