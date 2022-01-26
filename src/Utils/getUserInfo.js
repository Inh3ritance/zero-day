import { Xor, Rounds } from '../Utility';

// decrypt key w/sessionkey get user data(JSON)
const getUserInfo = async() => {
    const sessionKey = window.sessionStorage.getItem('sessionKey').toString();
    const appKey = window.localStorage.getItem('appKey').toString();
    const verifyKey = window.localStorage.getItem('verify').toString();
    let key = Xor(sessionKey, appKey); // get unencrypted csrng key
    const firstRound = Rounds(key, 1);
    let verify = Xor(verifyKey, firstRound);
    verify = verify.replace(/\/\[EXT:.*\]\//, '');
    try {
        verify = JSON.parse(verify);
        return {
            verify: true,
            username: verify.username,
            csrng: verify.csrng,
        }
    } catch(err) {
        console.log(err);
        return {
            verify: false,
            username: null,
            csrng: null,
        };
    }
}

export default getUserInfo;