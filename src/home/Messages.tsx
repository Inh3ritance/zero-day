import React, {
  useCallback, useRef,
} from 'react';
import {
  View, Image, Text, FlatList,
} from 'react-native';
import { Message } from './constants';
import { toLocalDateTimeFromISO } from '../utils/timeHelpers';
import styles from './styles/Messages.styles';

interface Props {
  messages: Message[];
}

const Messages = ({ messages }: Props) => {
  const flatListRef = useRef<FlatList<Message> | null>(null);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd();
    }
  }, [flatListRef]);

  const renderItem = useCallback(({ item: chat, index }: { item: Message, index: number }) => (
    <View
      style={[styles.chatBox, index === messages.length - 1 ? { marginBottom: '1rem' } : null]}
      key={chat.time}
    >
      <Image
        style={styles.chatImage}
        source={require('../assets/images/hidden_1.png')}
      />
      <View style={styles.chatTextContent}>
        <Text style={styles.chatUsername}>{chat.user}</Text>
        {/* /// @ts-expect-error Linkify doesn't have className defined as a prop, but leave it here for now */}
        <Text style={styles.chatMessage}>{chat.message}</Text>
        <Text style={styles.chatTime}>{toLocalDateTimeFromISO(chat.time)}</Text>
      </View>
    </View>
  ), []);

  return (
    <FlatList
      data={messages}
      contentContainerStyle={styles.contentContainer}
      ref={flatListRef}
      keyExtractor={(item) => item.time}
      renderItem={renderItem}
      onContentSizeChange={scrollToBottom}
    />
  );
};

export default React.memo(Messages);
