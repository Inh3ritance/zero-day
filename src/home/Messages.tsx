import React from 'react';
import Linkify from 'react-linkify';
import { SecureLink } from 'react-secure-link';
import { Message } from './constants';
import defaultHidden from '../assets/images/hidden_1.png';

interface Props {
  messages: Message[];
}

const Messages = ({ messages }: Props) => (
  <div>
    {
      messages.map((chat, index, arr) => {
        if (index === arr.length - 1) {
          return (
            <div className="chatBox" key={chat.time} id="last-message">
              <img
                className="img-circle media-object"
                alt="user"
                src={defaultHidden}
                width="50px"
                height="50px"
                style={{
                  display: 'inline-block', textAlign: 'center', border: '1px solid black', float: 'left', marginLeft: '1%', marginTop: '5px',
                }}
              />
              <div style={{ width: '85%', display: 'inline-block', marginLeft: '5px' }}>
                <p className="chat-username">{chat.user}</p>
                <p>
                  <Linkify
                    // eslint-disable-next-line
                componentDecorator={(decoratedHref, decoratedText, key) => (
                      // eslint-disable-next-line
                <SecureLink href={decoratedHref} key={key}>{decoratedText}</SecureLink>
                    )}
                    // @ts-expect-error Linkify types don't have className as a prop but leave as is for now
                    className="chat-message"
                  >
                    {chat.message}
                  </Linkify>
                </p>
                <p className="chat-time">{chat.time}</p>
              </div>
            </div>
          );
        }
        return (
          <div className="chatBox" key={chat.time}>
            <img
              className="img-circle media-object"
              alt="user"
              src={defaultHidden}
              width="50px"
              height="50px"
              style={{
                display: 'inline-block', textAlign: 'center', border: '1px solid black', float: 'left', marginLeft: '1%', marginTop: '5px',
              }}
            />
            <div style={{ width: '85%', display: 'inline-block', marginLeft: '5px' }}>
              <p className="chat-username">{chat.user}</p>
              <p>
                {/* @ts-expect-error Linkify doesn't have className defined as a prop, but leave it here for now */}
                <Linkify className="chat-message">{chat.message}</Linkify>
              </p>
              <p className="chat-time">{chat.time}</p>
            </div>
          </div>
        );
      })
    }
  </div>
);

export default React.memo(Messages);
