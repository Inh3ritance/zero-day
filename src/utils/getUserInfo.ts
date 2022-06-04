import { xor, rounds } from '../crypto/utils';
import { STORAGE_KEYS, VERIFY_REGEX } from './constants';

interface UserInfo {
    verify: boolean;
    username: string | null;
    csrng: string | null;
}

// decrypt key w/sessionkey get user data(JSON)
const getUserInfo = async (): Promise<UserInfo> => {
  const sessionKey = window.sessionStorage
    .getItem(STORAGE_KEYS.SESSION)?.toString() || '';
  const appKey = window.localStorage
    .getItem(STORAGE_KEYS.APP)?.toString() || '';
  const verifyKey = window.localStorage
    .getItem(STORAGE_KEYS.VERIFY)?.toString() || '';
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
