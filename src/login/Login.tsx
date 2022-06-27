import React, { useCallback, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
} from 'react-native';
import sha512 from 'crypto-js/sha512';
// @ts-ignore - TS doesn't know about faker for some reason
import faker from 'faker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { xor, rounds } from '../crypto/utils';
import { VERIFY_REGEX } from '../utils/constants';
import { appActions, appSelectors } from '../app/appSlice';
import { useAppDispatch, useMountEffect } from '../utils/hooks';
import styles from './styles/Login.styles';

const Login = () => {
  const dispatch = useAppDispatch();
  const appKey = useSelector(appSelectors.appKeySelector);
  const sessionKey = useSelector(appSelectors.sessionKeySelector);
  const verifyKey = useSelector(appSelectors.verifyKeySelector);

  const [keyCode, setKeyCode] = useState<Array<number | null>>([]);
  const [username, setUsername] = useState<string>(faker.name.firstName());

  const login = useCallback((sessionKeyParam: string) => {
    if (!appKey) {
      return;
    }
    const key = xor(sessionKeyParam, appKey); // get unencrypted csrng key
    const firstRound = rounds(key, 1); // First generation/round
    let verify = xor(verifyKey || '', firstRound);
    verify = verify.replace(VERIFY_REGEX, '');
    try {
      verify = JSON.parse(verify);
      if (verify) {
        dispatch(appActions.setSessionKey(sessionKeyParam));
      }
    } catch (err) {
      console.warn('Invalid session --', err);
      dispatch(appActions.setSessionKey(null));
      setKeyCode([]);
    }
  }, [dispatch, appKey, verifyKey, setKeyCode]);

  // Determine whether an encryption token exists
  useMountEffect(() => {
    const init = async () => {
      if (sessionKey && appKey) { // If both exist, then the user is logged in
        login(sessionKey);
      }
    };
    init();
  });

  const createUser = useCallback(() => {
    const keycodeString = keyCode.join('');
    dispatch(appActions.createUser({ username, keycode: keycodeString }));
  }, [dispatch, keyCode, username]);

  // submit 4 keys and generate encryption tokens || verify existing encryption token
  const onSubmit = useCallback(() => {
    if (appKey && keyCode.length === 4) {
      const sessionHash = sha512(keyCode.join(''));
      const sessionKeyArg = sessionHash.toString();
      dispatch(appActions.setSessionKey(sessionKeyArg));

      login(sessionKeyArg);
    } else if (keyCode.length === 4 && username.length > 3) {
      createUser();
    } else {
      setKeyCode([]);
    }
  }, [keyCode, username, appKey, createUser, login, setKeyCode]);

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
