import React, { useCallback, useMemo } from 'react';
import ReactSidebar from 'react-sidebar';
import Popup from 'reactjs-popup';
import { Socket } from 'socket.io-client';
import { Friend } from './constants';
import { useMediaQuery } from '../utils/hooks';
import { COLORS } from '../shared/constants';

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

  const onSearchFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFieldValue(e.currentTarget.value);
  }, [setSearchFieldValue]);

  const openSidebar = useCallback(() => {
    onSetOpen(true);
  }, [onSetOpen]);

  const contactList = useMemo(() => friends.map((user) => {
    if (searchField.length > 0 && user.username.toLowerCase().indexOf(searchField.toLowerCase()) !== -1) {
      return (
        <button
          className="sidebarUserButton"
          key={user.username}
          type="button"
          onClick={() => selectUser(user.username)}
        >
          <li className="list-group-item">
            <img alt="user" className="img-circle media-object pull-left inActiveUser" src={user.image} width="50px" height="50px" />
            <div className="media-body">
              <strong>{user.username}</strong>
              <p>{user.lastMessage}</p>
            </div>
          </li>
        </button>
      );
    } if (searchField.length <= 0) {
      return (
        <button
          className="sidebarUserButton"
          key={user.username}
          type="button"
          onClick={() => selectUser(user.username)}
        >
          <li className="list-group-item">
            <img alt="user" className="img-circle media-object pull-left inActiveUser" src={user.image} width="50px" height="50px" />
            <div className="media-body">
              <strong>{user.username}</strong>
              <p>{user.lastMessage}</p>
            </div>
          </li>
        </button>
      );
    }
    return null;
  }), [friends, searchField, selectUser]);

  const sidebarContent = useMemo(() => (
    <div className="pane-sm sidebar">
      { /* TODO - Feel like this shouldn't be a list. Use random key for now */ }
      <ul key={Math.random()} className="list-group">
        <li className="list-group-header">
          <div>
            <img className="img-circle media-object activeUser" alt="user" src="" width="50px" height="50px" style={{ margin: 'auto', display: 'block', textAlign: 'center' }} />
            <h5 style={{
              textAlign: 'center', color: 'white', marginTop: '7px', marginBottom: '7px',
            }}
            >
              {username}
            </h5>
            <h5 style={{
              textAlign: 'center', color: 'white', marginTop: '7px', marginBottom: '7px',
            }}
            >
              {`socket #: ${socket}`}
            </h5>
          </div>
          <input className="form-control" type="text" placeholder="Search for someone" onChange={onSearchFieldChange} />
        </li>

        <button className="sidebarUserButton" type="button" onClick={selectPublicChat}>
          <h4
            className={selectedUser === 'public' ? 'activeRoom' : ''}
            style={{ color: 'white' }}
          >
            Public chat
          </h4>
        </button>
        <h4 style={{
          color: 'grey', marginLeft: '10px', marginBottom: '5px', marginRight: '10px', borderBottom: '1px solid grey',
        }}
        >
          Direct messages
        </h4>
        {contactList}
        <h4 style={{
          color: 'grey', marginLeft: '10px', marginBottom: '5px', marginRight: '10px', borderBottom: '1px solid grey',
        }}
        >
          Group chats
        </h4>
      </ul>
      <Popup modal position="center center" trigger={<button type="button" className="addUser">+</button>}>
        {
          (close: React.MouseEventHandler<HTMLButtonElement>) => (
            <div className="modal">
              <button className="close" type="button" onClick={close}>&times;</button>
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
                <button id="addUserSubmit" type="button" onClick={() => console.log('submit to server')}>Submit</button>
              </div>
            </div>
          )
        }
      </Popup>
    </div>
  ), [socket, username, contactList, selectedUser, selectPublicChat, selectUser, setSearchFieldValue]);

  return (
    <ReactSidebar
      sidebar={sidebarContent}
      open={isOpen}
      docked={!isMobile}
      onSetOpen={onSetOpen}
      styles={{
        root: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <div className="pane-group">
        <div className="pane">
          {isMobile && <button className="sidebarButton" type="button" onClick={openSidebar}>+</button>}
          {children}
        </div>
      </div>
    </ReactSidebar>
  );
};

export default Sidebar;
