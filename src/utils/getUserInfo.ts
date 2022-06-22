import AsyncStorage from '@react-native-async-storage/async-storage';
import { xor, rounds } from '../crypto/utils';
import { STORAGE_KEYS, VERIFY_REGEX } from './constants';

interface UserInfo {
    verify: boolean;
    username: string | null;
    csrng: string | null;
}

// decrypt key w/sessionkey get user data(JSON)
const getUserInfo = async (): Promise<UserInfo> => {
  const values = await AsyncStorage.multiGet([
    STORAGE_KEYS.SESSION,
    STORAGE_KEYS.APP,
    STORAGE_KEYS.VERIFY,
  ]);
  const sessionKey = values[0][1] || '';
  const appKey = values[1][1] || '';
  const verifyKey = values[2][1] || '';
  console.log({ sessionKey, appKey, verifyKey });
  const key = xor(sessionKey, appKey); // get unencrypted csrng key
  const firstRound = rounds(key, 1);
  let verify = xor(verifyKey, firstRound);
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
};

export default getUserInfo;
