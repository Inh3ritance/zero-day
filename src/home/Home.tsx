import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { View, TextInput } from 'react-native';
import { io, Socket } from 'socket.io-client';
import Messages from './Messages';
import {
  DEFAULT_FRIENDS,
  DEFAULT_LOADED_MESSAGES,
  Friend,
  Message,
} from './constants';

import { homeActions } from './homeSlice';
import { appActions, appSelectors } from '../app/appSlice';
import { useAppDispatch, useAppSelector, useMountEffect } from '../utils/hooks';

import { SOCKET_EVENTS } from '../utils/constants';
import styles from './styles/Home.styles';

const Home = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(appSelectors.userInfoSelector);

  const socketRef = useRef<Socket | null>(null);

  const [username, setUsername] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  // Fixme: `setFriends` isn't being used right now because `friends` is mocked
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [friends, setFriends] = useState<Friend[]>(DEFAULT_FRIENDS);
  const [searchField, setSearchField] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('public');
  const [loadedMessages, setLoadedMessages] = useState<Message[]>(DEFAULT_LOADED_MESSAGES);
  const [message, setMessage] = useState<string>('');

  // get user info and connect to socket.io
  useMountEffect(() => {
    const init = async () => {
      setUsername(userInfo.username);

      socketRef.current = io('http://localhost:9000' || '');
      socketRef.current.emit(SOCKET_EVENTS.LOGIN, { user: userInfo.username, pass: userInfo.csrng });
      socketRef.current.on(SOCKET_EVENTS.UPDATE_SOCKET, (data: { socket: string }) => {
        dispatch(homeActions.setSocketNumber(data?.socket));
      });
      socketRef.current.on(SOCKET_EVENTS.DISCONNECT, () => {
        dispatch(appActions.logout());
      });
      /* if(indexedDB.open('users').result.objectStoreNames.length <= 0) {
        let db = indexedDB.open('users').result;
        let data = {
          id: '' + 0,
          name: 'kevin',
          key: 'osososos',
          image: '.png',
        }
        db.transaction(['users'], 'readwrite').objectStore('users').add(

        );
      } */
    };
    init().catch((err) => console.error(err));
  });

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(SOCKET_EVENTS.PUBLIC_RETRIEVE, (data) => {
        if (selectedUser === 'public') {
          setLoadedMessages((prev) => [
            ...prev,
            { user: 'Anon', message: data.message, time: data.datetime },
          ]);
        }
      });
    }
  }, [selectedUser, setLoadedMessages, socketRef]);

  // const selectUser = useCallback((usernameVal: string) => {
  //   setSelectedUser(usernameVal);
  //   setIsSidebarOpen(false);
  // }, [setSelectedUser, setIsSidebarOpen]);

  // const selectPublicChat = useCallback(() => {
  //   if (selectedUser !== 'public') {
  //     setSelectedUser('public');
  //     setIsSidebarOpen(false);
  //     setLoadedMessages([]);
  //   } else {
  //     setSelectedUser('public');
  //     setIsSidebarOpen(false);
  //   }
  // }, [setSelectedUser, setIsSidebarOpen, setLoadedMessages]);

  const sendMessage = useCallback(() => {
    if (selectedUser === 'public' && message.length > 0) { // send unencrypted message through public channel
      socketRef.current?.emit(SOCKET_EVENTS.PUBLIC_SEND, { message });
    } else {
      // TODO: Are we planning to do anything with this else block in the future?
      // encrypt before sending, also check for incoming messages before submition. chat group or individual user
    }
    setMessage('');
  }, [socketRef, selectedUser, message, setMessage]);

  return (
    <View style={styles.window} testID="Home">
      <View style={styles.windowContent}>
        <Messages messages={loadedMessages} />
        <View style={styles.messageBarSpacer} />
        <View style={styles.messageBar}>
          <TextInput
            style={styles.messageBarInputText}
            placeholder="Send a messsage"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;
