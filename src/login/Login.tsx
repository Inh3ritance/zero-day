import React, { useCallback, useState } from 'react';
import sha512 from 'crypto-js/sha512';
// @ts-ignore - TS doesn't know about faker for some reason
import faker from 'faker';
import { xor, rounds, conformPlainText } from '../crypto/utils';
import { STORAGE_KEYS, VERIFY_REGEX } from '../utils/constants';
import { createUserRequest } from './api';
import { useMountEffect } from '../utils/hooks';
import { CREATE_USER_ERROR } from './constants';
import './styles/Login.scss';

interface Props {
  approve: () => void;
}

const Login = ({ approve }: Props) => {
  const appKey = window.localStorage.getItem(STORAGE_KEYS.APP);

  const [keyCode, setKeyCode] = useState<Array<number | null>>([]);
  const [username, setUsername] = useState<string>(faker.name.firstName());

  const login = useCallback((sessionKey: string) => {
    if (!appKey) {
      return;
    }
    const verifyKey = window.localStorage
      .getItem(STORAGE_KEYS.VERIFY)
      ?.toString() as string;
    const key = xor(sessionKey, appKey); // get unencrypted csrng key
    const firstRound = rounds(key, 1); // First generation/round
    let verify = xor(verifyKey, firstRound);
    verify = verify.replace(VERIFY_REGEX, '');
    try {
      verify = JSON.parse(verify);
      if (verify) {
        approve();
      }
    } catch (err) {
      console.warn('Invalid session --', err);
      window.sessionStorage.removeItem(STORAGE_KEYS.SESSION);
      setKeyCode([]);
    }
  }, [approve, setKeyCode]);

  // Determine whether a encryption token exists
  useMountEffect(() => {
    const sessionKey = window.sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (sessionKey && appKey) { // If both exist, then the user is logged in
      login(sessionKey);
    }
  });

  const createUser = useCallback(async () => {
    const sessionHash = sha512(keyCode.join(''));
    const sessionKey = sessionHash.toString();

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
      window.sessionStorage.setItem(STORAGE_KEYS.SESSION, sessionKey);
      window.localStorage.setItem(STORAGE_KEYS.APP, key);
      window.localStorage.setItem(STORAGE_KEYS.VERIFY, hashedUser);
      approve();
    } else {
      // username taken
      console.warn(CREATE_USER_ERROR);
      window.sessionStorage.clear();
      window.localStorage.clear();
    }
  }, [username, approve, keyCode]);

  // submit 4 keys and generate encryption tokens || verify existing encryption token
  const onSubmit = useCallback((e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();

    if (appKey && keyCode.length === 4) {
      const sessionHash = sha512(keyCode.join(''));
      const sessionKey = sessionHash.toString();
      window.sessionStorage.setItem(STORAGE_KEYS.SESSION, sessionKey);

      login(sessionKey);
    } else if (keyCode.length === 4 && username.length > 3) {
      createUser();
    } else {
      setKeyCode([]);
    }
  }, [keyCode, username, createUser, login, setKeyCode]);

  const handleKeyCodeChange = useCallback((e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();

    const value = Number(e.currentTarget.value);

    setKeyCode((prev) => {
      if (prev?.length > 3) { // if we have 4 keys, then we are done
        return prev;
      }
      return [...prev, value];
    });
  }, [keyCode, setKeyCode]);

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, [setUsername]);

  // clears keys
  const clearKeys = useCallback((e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();
    setKeyCode([]);
  }, [setKeyCode]);

  return (
    <div className="login-screen">
      <h1>Zero Day Messaging</h1>
      {
        appKey && (
          <input
            id="username-input"
            maxLength={12}
            placeholder="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        )
      }
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="login-label">Enter Passcode:</label>
      <div className="input-scores">
        <h2 className="input-bar">{keyCode[0] === undefined ? '_' : '*' }</h2>
        <h2 className="input-bar">{keyCode[1] === undefined ? '_' : '*' }</h2>
        <h2 className="input-bar">{keyCode[2] === undefined ? '_' : '*' }</h2>
        <h2 className="input-bar">{keyCode[3] === undefined ? '_' : '*' }</h2>
      </div>
      <form className="dial-pad">
        <input className="dial-button" type="button" value={1} onClick={handleKeyCodeChange} />
        <input className="dial-button" type="button" value={2} onClick={handleKeyCodeChange} />
        <input className="dial-button" type="button" value={3} onClick={handleKeyCodeChange} />
        <input className="dial-button" type="button" value={4} onClick={handleKeyCodeChange} />
        <input className="dial-button" type="button" value={5} onClick={handleKeyCodeChange} />
        <input className="dial-button" type="button" value={6} onClick={handleKeyCodeChange} />
        <input className="dial-button" type="button" value={7} onClick={handleKeyCodeChange} />
        <input className="dial-button" type="button" value={8} onClick={handleKeyCodeChange} />
        <input className="dial-button" type="button" value={9} onClick={handleKeyCodeChange} />
        <input className="dial-button -clear" type="button" value="X" onClick={clearKeys} />
        <input className="dial-button" type="button" value={0} onClick={handleKeyCodeChange} />
        <input className="dial-button -submit" type="button" value="T" onClick={onSubmit} />
      </form>
    </div>
  );
};

export default Login;
