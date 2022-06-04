import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import LogoIntro from './LogoIntro';
import Messages from './Messages';
import userInfo from '../utils/getUserInfo';
import {
  Friend,
  Message,
  DEFAULT_FRIENDS,
  DEFAULT_LOADED_MESSAGES,
} from './constants';
import Sidebar from './Sidebar';
import { useMountEffect } from '../utils/hooks';
import { logout } from '../utils/sessionHelpers';
import { SOCKET_EVENTS } from '../utils/constants';
import './styles/Home.scss';

const { REACT_APP_BACKEND_URL } = process.env;

const Home = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  // Fixme: `setFriends` isn't being used right now because `friends` is mocked
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [friends, setFriends] = useState<Friend[]>(DEFAULT_FRIENDS);
  const [searchField, setSearchField] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [loadedMessages, setLoadedMessages] = useState<Message[]>(DEFAULT_LOADED_MESSAGES);
  const [message, setMessage] = useState<string>('');

  // get user info and connect to socket.io
  useMountEffect(() => {
    const init = async () => {
      const res = await userInfo();
      setUsername(res.username);

      socketRef.current = io(REACT_APP_BACKEND_URL || '');
      socketRef.current.emit(SOCKET_EVENTS.LOGIN, { user: res.username, pass: res.csrng });
      socketRef.current.on(SOCKET_EVENTS.UPDATE_SOCKET, (data) => {
        setSocket(data.socket);
      });
      socketRef.current.on(SOCKET_EVENTS.DISCONNECT, logout);
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

  const selectUser = useCallback((usernameVal: string) => {
    setSelectedUser(usernameVal);
    setIsSidebarOpen(false);
  }, [setSelectedUser, setIsSidebarOpen]);

  const selectPublicChat = useCallback(() => {
    if (selectedUser !== 'public') {
      setSelectedUser('public');
      setIsSidebarOpen(false);
      setLoadedMessages([]);
    } else {
      setSelectedUser('public');
      setIsSidebarOpen(false);
    }
  }, [setSelectedUser, setIsSidebarOpen, setLoadedMessages]);

  const sendMessage = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUser === 'public' && message.length > 0) { // send unencrypted message through public channel
      socketRef.current?.emit(SOCKET_EVENTS.PUBLIC_SEND, { message });
    } else {
      // TODO: Are we planning to do anything with this else block in the future?
      // encrypt before sending, also check for incoming messages before submition. chat group or individual user
    }
    formRef.current?.reset();
    setMessage('');
  }, [formRef, socketRef, selectedUser, message, setMessage]);

  const onMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, [setMessage]);

  return (
    <div className="window" data-testid="Home">
      <div className="window-content">
        <Sidebar
          friends={friends}
          selectUser={selectUser}
          selectPublicChat={selectPublicChat}
          socket={socket}
          username={username}
          selectedUser={selectedUser}
          isOpen={isSidebarOpen}
          onSetOpen={setIsSidebarOpen}
          searchField={searchField}
          setSearchFieldValue={setSearchField}
        >
          {/* Page content will be wrapped with Sidebar support */}
          <LogoIntro />
          <Messages messages={loadedMessages} />
          <form className="message-bar" onSubmit={sendMessage} ref={formRef}>
            <input
              className="message-bar-input"
              type="text"
              onInput={onMessageChange}
              placeholder="send a messsage"
            />
          </form>
        </Sidebar>
      </div>
    </div>
  );
};

export default Home;
