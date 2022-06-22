import React, { useCallback, useMemo } from 'react';
import {
  View, Text, Button, Image, TextInput, TouchableOpacity,
} from 'react-native';
// import ReactSidebar from 'react-sidebar';
// import Popup from 'reactjs-popup';
import { Socket } from 'socket.io-client';
import { Friend } from './constants';
import { useMediaQuery } from '../utils/hooks';
import { COLORS } from '../shared/constants';
import styles from './styles/Home.styles';

interface Props {
  children: React.ReactNode;
  friends: Friend[];
  isOpen: boolean;
  username: string | null;
  searchField: string;
  selectedUser: string;
  socket: Socket | null;
  onSetOpen: (open: boolean) => void;
  selectUser: (username: string) => void;
  selectPublicChat: () => void;
  setSearchFieldValue: (value: string) => void;
}

// TODO: Reduce prop drilling by introducing some state management
// be it redux or something else (e.g. Context API)
const Sidebar = ({
  children,
  friends,
  isOpen,
  username,
  searchField,
  selectedUser,
  socket,
  onSetOpen,
  selectPublicChat,
  selectUser,
  setSearchFieldValue,
}: Props) => {
  const { isMobile } = useMediaQuery();

  const openSidebar = useCallback(() => {
    onSetOpen(true);
  }, [onSetOpen]);

  const contactList = useMemo(() => friends.map((user) => {
    if (searchField.length > 0 && user.username.toLowerCase().indexOf(searchField.toLowerCase()) !== -1) {
      return (
        <TouchableOpacity
          style={styles.sidebarUserButton}
          key={user.username}
          onPress={() => selectUser(user.username)}
        >
          <View style={styles.listGroupItem}>
            <Image
              style={[
                styles.imgCircle,
                styles.mediaObject,
                styles.mediaObjectPullLeft,
                styles.inActiveUser,
                { width: 50, height: 50 },
              ]}
              source={require('../assets/images/hidden_1.png')}
            />
            <View>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{user.username}</Text>
              <Text style={{ color: 'white' }}>{user.lastMessage}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } if (searchField.length <= 0) {
      return (
        <TouchableOpacity
          style={styles.sidebarUserButton}
          key={user.username}
          onPress={() => selectUser(user.username)}
        >
          <View style={styles.listGroupItem}>
            <Image
              style={[
                styles.mediaObjectPullLeft, styles.inActiveUser, { width: 50, height: 50 },
              ]}
              source={require('../assets/images/hidden_1.png')}
            />
            <View style={styles.mediaBody}>
              <Text style={{ fontWeight: 'bold' }}>{user.username}</Text>
              <Text>{user.lastMessage}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  }), [friends, searchField, selectUser]);

  const sidebarContent = useMemo(() => (
    <View style={[styles.paneSmall, styles.sidebar]}>
      { /* TODO - Feel like this shouldn't be a list. Use random key for now */ }
      <View key={Math.random()} style={styles.listGroup}>
        <View style={styles.listGroupHeader}>
          <View>
            <Image
              source={require('../assets/images/hidden_1.png')}
              style={[
                styles.imgCircle, styles.mediaObject, styles.activeUser, {
                  width: 50, height: 50, margin: 'auto',
                },
              ]}
            />
            <Text style={{
              textAlign: 'center', color: 'white', marginTop: '7px', marginBottom: '7px',
            }}
            >
              {username}
            </Text>
            <Text style={{
              textAlign: 'center', color: 'white', marginTop: '7px', marginBottom: '7px',
            }}
            >
              {`socket #: ${socket}`}
            </Text>
          </View>
          <TextInput style={styles.formControl} placeholder="Search for someone" onChangeText={setSearchFieldValue} />
        </View>

        <TouchableOpacity style={styles.sidebarUserButton} onPress={selectPublicChat}>
          <Text
            style={[selectedUser === 'public' ? styles.activeRoom : null, { color: 'white' }]}
          >
            Public chat
          </Text>
        </TouchableOpacity>
        <Text style={{
          color: 'grey', marginLeft: '10px', marginBottom: '5px', marginRight: '10px', borderBottomColor: 'grey', borderBottomWidth: 1,
        }}
        >
          Direct messages
        </Text>
        {contactList}
        <Text style={{
          color: 'grey', marginLeft: '10px', marginBottom: '5px', marginRight: '10px', borderBottomColor: 'grey', borderBottomWidth: 1,
        }}
        >
          Group chats
        </Text>
      </View>
      {/* <Popup modal position="center center" trigger={<Button type="button" className="addUser">+</Button>}>
        {
          (close: React.MouseEventHandler<HTMLButtonElement>) => (
            <div className="modal">
              <Button className="close" type="button" onClick={close}>&times;</Button>
              <h3 style={{
                color: 'white', textAlign: 'center', borderBottom: '1px solid gray', width: '90%', margin: 'auto',
              }}
              >
                {' '}
                Create/Join Chatroom
              </h3>
              <div className="content">
                <input className="addUserInput" type="text" placeholder="secret key" />
                <input className="addUserInput" type="text" placeholder="chatroom #" />
                <Button id="addUserSubmit" type="button" onClick={() => console.log('submit to server')}>Submit</Button>
              </div>
            </div>
          )
        }
      </Popup> */}
    </View>
  ), [socket, username, contactList, selectedUser, selectPublicChat, selectUser, setSearchFieldValue]);

  return (
    <View
      // sidebar={sidebarContent}
      // open={isOpen}
      // docked={!isMobile}
      // onSetOpen={onSetOpen}
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      <View style={styles.paneGroup}>
        <View style={styles.pane}>
          {isMobile && <Button title="+" onPress={openSidebar} />}
          {children}
        </View>
      </View>
    </View>
  );
};

export default Sidebar;
