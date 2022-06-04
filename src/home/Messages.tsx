import React, { useEffect, useRef } from 'react';
import Linkify from 'react-linkify';
import { Message } from './constants';
import { toLocalDateTimeFromISO } from '../utils/timeHelpers';
import defaultHidden from '../assets/images/hidden_1.png';

interface Props {
  messages: Message[];
}

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    elementRef.current?.scrollIntoView();
  });
  return <div ref={elementRef} />;
};

const Messages = ({ messages }: Props) => (
  <div>
    {
      messages.map((chat, index) => (
        <div className="chatBox" key={chat.time} style={index === messages.length - 1 ? { marginBottom: '1rem' } : undefined}>
          <img
            className="chat-image"
            alt="user"
            src={defaultHidden}
          />
          <div className="chat-text-content">
            <p className="chat-username">{chat.user}</p>
            <p>
              {/* @ts-expect-error Linkify doesn't have className defined as a prop, but leave it here for now */}
              <Linkify className="chat-message">{chat.message}</Linkify>
            </p>
            <p className="chat-time">{toLocalDateTimeFromISO(chat.time)}</p>
          </div>
        </div>
      ))
    }
    <AlwaysScrollToBottom />
  </div>
);

export default React.memo(Messages);
