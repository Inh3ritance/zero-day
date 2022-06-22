import React, { useCallback, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sha512 from 'crypto-js/sha512';
// @ts-ignore - TS doesn't know about faker for some reason
import faker from 'faker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { xor, rounds, conformPlainText } from '../crypto/utils';
import { STORAGE_KEYS, VERIFY_REGEX } from '../utils/constants';
import { createUserRequest } from './api';
import { useMountEffect } from '../utils/hooks';
import { CREATE_USER_ERROR } from './constants';
import styles from './styles/Login.styles';

interface Props {
  approve: () => void;
}

const Login = ({ approve }: Props) => {
  const [appKey, setAppKey] = useState<string | null>(null);

  const [keyCode, setKeyCode] = useState<Array<number | null>>([]);
  const [username, setUsername] = useState<string>(faker.name.firstName());

  const login = useCallback(async (sessionKey: string) => {
    const appKeyValue = await AsyncStorage.getItem(STORAGE_KEYS.APP);
    setAppKey(appKeyValue);
    if (!appKeyValue) {
      return;
    }
    const verifyKey = await AsyncStorage.getItem(STORAGE_KEYS.VERIFY) || '';
    const key = xor(sessionKey, appKeyValue); // get unencrypted csrng key
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
      AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
      setKeyCode([]);
    }
  }, [approve, setAppKey, setKeyCode]);

  // Determine whether a encryption token exists
  useMountEffect(() => {
    const init = async () => {
      const sessionKey = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
      const appKeyValue = await AsyncStorage.getItem(STORAGE_KEYS.APP);
      setAppKey(appKeyValue);
      if (sessionKey && appKeyValue) { // If both exist, then the user is logged in
        login(sessionKey);
      }
    };
    init();
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
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.SESSION, sessionKey],
        [STORAGE_KEYS.APP, key],
        [STORAGE_KEYS.VERIFY, hashedUser],
      ]);
      approve();
    } else {
      // username taken
      console.warn(CREATE_USER_ERROR);
      await AsyncStorage.multiRemove([STORAGE_KEYS.SESSION, STORAGE_KEYS.APP, STORAGE_KEYS.VERIFY]);
    }
  }, [username, approve, keyCode]);

  // submit 4 keys and generate encryption tokens || verify existing encryption token
  const onSubmit = useCallback(async () => {
    const appKeyValue = await AsyncStorage.getItem(STORAGE_KEYS.APP);
    setAppKey(appKeyValue);
    if (appKeyValue && keyCode.length === 4) {
      const sessionHash = sha512(keyCode.join(''));
      const sessionKey = sessionHash.toString();
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION, sessionKey);

      login(sessionKey);
    } else if (keyCode.length === 4 && username.length > 3) {
      createUser();
    } else {
      setKeyCode([]);
    }
  }, [keyCode, username, createUser, login, setAppKey, setKeyCode]);

  const handleKeyCodeChange = useCallback((value: number) => {
    setKeyCode((prev) => {
      if (prev?.length > 3) { // if we have 4 keys, then we are done
        return prev;
      }
      return [...prev, value];
    });
  }, [keyCode, setKeyCode]);

  // clears keys
  const clearKeys = useCallback(() => {
    setKeyCode([]);
  }, [setKeyCode]);

  console.log({ appKey });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ width: '75%' }}>
        <Text style={styles.title}>Zero Day Messaging</Text>
        {
          !appKey && (
            <View style={styles.usernameInputContainer}>
              <TextInput
                style={styles.usernameInput}
                maxLength={12}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          )
        }
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <Text style={styles.loginLabel}>Enter Passcode:</Text>
        <View style={styles.passcodeInputContainer}>
          <Text style={styles.passcodeInput}>{keyCode[0] === undefined ? '_' : '*' }</Text>
          <Text style={styles.passcodeInput}>{keyCode[1] === undefined ? '_' : '*' }</Text>
          <Text style={styles.passcodeInput}>{keyCode[2] === undefined ? '_' : '*' }</Text>
          <Text style={styles.passcodeInput}>{keyCode[3] === undefined ? '_' : '*' }</Text>
        </View>
        <View style={styles.dialPadContainer}>
          <View style={styles.dialPad}>
            <TouchableOpacity style={styles.dialButtonContainer} onPress={() => handleKeyCodeChange(1)}>
              <Text style={styles.dialButton}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainer} onPress={() => handleKeyCodeChange(2)}>
              <Text style={styles.dialButton}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainer} onPress={() => handleKeyCodeChange(3)}>
              <Text style={styles.dialButton}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainer} onPress={() => handleKeyCodeChange(4)}>
              <Text style={styles.dialButton}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainer} onPress={() => handleKeyCodeChange(5)}>
              <Text style={styles.dialButton}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainer} onPress={() => handleKeyCodeChange(6)}>
              <Text style={styles.dialButton}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainer} onPress={() => handleKeyCodeChange(7)}>
              <Text style={styles.dialButton}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainer} onPress={() => handleKeyCodeChange(8)}>
              <Text style={styles.dialButton}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainer} onPress={() => handleKeyCodeChange(9)}>
              <Text style={styles.dialButton}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainerClear} onPress={clearKeys}>
              <Text style={styles.dialButtonClear}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainer} onPress={() => handleKeyCodeChange(0)}>
              <Text style={styles.dialButton}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialButtonContainerSubmit} onPress={onSubmit}>
              <Text style={styles.dialButtonSubmit}>T</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
