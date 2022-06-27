import React, { useCallback, useMemo } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { appSelectors } from '../app/appSlice';
import { homeSelectors, homeActions } from '../home/homeSlice';

import { DEFAULT_FRIENDS } from '../home/constants';

import styles from './styles/drawerContent.styles';

const DrawerContent = (_props: DrawerContentComponentProps) => {
  const dispatch = useAppDispatch();
  const { username } = useAppSelector(appSelectors.userInfoSelector);
  const selectedChat = useAppSelector(homeSelectors.selectedChatSelector);
  const socketNumber = useAppSelector(homeSelectors.socketNumberSelector);

  const handleSelectChat = useCallback((chatId: string) => {
    dispatch(homeActions.setSelectedChat(chatId));
  }, [dispatch]);

  const contactList = useMemo(() => DEFAULT_FRIENDS.map((user) => (
    <TouchableOpacity
      style={styles.sidebarUserButton}
      key={user.username}
      onPress={() => handleSelectChat(user.username)}
    >
      <View style={styles.listGroupItem}>
        <Image
          style={[
            styles.mediaObjectPullLeft,
            styles.inActiveUser,
            { width: 50, height: 50 },
          ]}
          source={require('../assets/images/hidden_1.png')}
        />
        <View style={styles.mediaBody}>
          <Text style={{ fontWeight: 'bold' }}>{user.username}</Text>
          <Text>{user.lastMessage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )), [handleSelectChat]);

  return (
    <DrawerContentScrollView style={[styles.paneSmall, styles.sidebar]}>
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
              {`socket #: ${socketNumber}`}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.sidebarUserButton} onPress={() => handleSelectChat('public')}>
          <Text
            style={[selectedChat === 'public' ? styles.activeRoom : null, { color: 'white' }]}
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
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
