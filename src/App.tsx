import React, {
  Component,
  RefObject,
  createRef,
  MutableRefObject,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { SecureLink } from 'react-secure-link';
import Sidebar from 'react-sidebar';
import Popup from 'reactjs-popup';
import Linkify from 'react-linkify';
import { Header, LogoIntro } from './statelessComponents/Components';
import defaultHidden from './assets/images/hidden_1.png';
import userInfo from './Utils/getUserInfo';
import './App.css';

export const URL = 'http://localhost:9000';

// TODO - Friend and Message types should probably be moved to a separate file. Same with URL constant

interface Friend {
  username: string;
  image: string;
  lastMessage: string;
  hashKeyPattern: string;
  active: boolean;
  newMessages: number;
}

interface Message {
  user: string;
  message: string;
  time: string;
}

interface State {
  socket: Socket | null;
  username: string | null;
  sidebar: boolean;
  csrng: string | null;
  friends: Friend[];
  searchField: string;
  selectedUser: string;
  verify?: boolean;
  loadedMessages: Message[];
  message: string;
}

class App extends Component<{}, State> {
  form: RefObject<HTMLFormElement>;

  socket: MutableRefObject<Socket | null>;

  constructor(props: {}) {
    super(props);
    this.form = createRef();
    this.socket = createRef();
    this.state = {
      friends: [ // encrypted and saved locally
        {
          username: 'test1',
          image: 'mksms.png',
          lastMessage: 'lorem oskskkskksk',
          hashKeyPattern: 'ghjhgjgjghj',
          active: false,
          newMessages: 0,
        },
        {
          username: 'test2',
          image: 'mksms.png',
          lastMessage: 'hgjkgh oskskkskksk',
          hashKeyPattern: 'ghjhgjgjghj',
          active: false,
          newMessages: 0,
        },
      ],
      searchField: '',
      selectedUser: '',
      loadedMessages: [ // encrypted and saved locally
        {
          user: 'rick',
          message: 'ticky whoicky kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj',
          time: 'UTC',
        },
        {
          user: 'rick',
          message: 'schwonk',
          time: '11pm',
        },
        {
          user: 'Inhe',
          message: 'test',
          time: '4am',
        },
      ],
      username: null, // encrypted and saved locally
      csrng: null, // encrypted and saved locally
      sidebar: false,
      socket: null,
      message: '',
    };
    this.listContacts = this.listContacts.bind(this);
    this.sidebar = this.sidebar.bind(this);
    this.loadMessages = this.loadMessages.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.selectPublicChat = this.selectPublicChat.bind(this);
  }

  // get userinfo and connect to socket.io
  async componentDidMount() {
    this.setState(await userInfo());
    this.socket.current = io(URL);
    this.socket.current.emit('login', { user: this.state.username, pass: this.state.csrng });
    this.socket.current.on('updateSocket', (data) => {
      this.setState({ socket: data.socket });
    });
    this.socket.current.on('public-retrieve', (data) => {
      if (this.state.selectedUser === 'public') {
        this.setState((prevState) => ({
          loadedMessages: [
            ...prevState.loadedMessages,
            { user: 'Anon', message: data.message, time: data.date },
          ],
        }));
      }
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
  }

  componentDidUpdate(_: State, prevState: State) {
    if (prevState.selectedUser !== this.state.selectedUser) {
      this.loadMessages();
    }
  }

  onSetSidebarOpen(open: boolean) {
    this.setState({ sidebar: open });
  }

  listContacts() {
    return this.state.friends.map((user) => {
      if (this.state.searchField.length > 0 && user.username.toLowerCase().indexOf(this.state.searchField.toLowerCase()) !== -1) {
        return (
          <button className="sidebarUserButton" type="button" onClick={() => this.setState({ selectedUser: user.username, sidebar: false })}>
            <li className="list-group-item">
              <img alt="user" className="img-circle media-object pull-left inActiveUser" src={user.image} width="50px" height="50px" />
              <div className="media-body">
                <strong>{user.username}</strong>
                <p>{user.lastMessage}</p>
              </div>
            </li>
          </button>
        );
      } if (this.state.searchField.length <= 0) {
        return (
          <button className="sidebarUserButton" type="button" onClick={() => this.setState({ selectedUser: user.username, sidebar: false })}>
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
    });
  }

  sidebar() {
    return (
      // TODO - Feel like this shouldn't be a list. Use random key for now
      <ul key={Math.random()} className="list-group">
        <li className="list-group-header">
          <div>
            <img className="img-circle media-object activeUser" alt="user" src="" width="50px" height="50px" style={{ margin: 'auto', display: 'block', textAlign: 'center' }} />
            <h5 style={{
              textAlign: 'center', color: 'white', marginTop: '7px', marginBottom: '7px',
            }}
            >
              {this.state.username}
            </h5>
            <h5 style={{
              textAlign: 'center', color: 'white', marginTop: '7px', marginBottom: '7px',
            }}
            >
              socket#:
              {this.state.socket}
            </h5>
          </div>
          <input className="form-control" type="text" placeholder="Search for someone" onChange={(ev) => this.setState({ searchField: ev.currentTarget.value })} />
        </li>

        <button className="sidebarUserButton" type="button" onClick={this.selectPublicChat}>
          <h4
            className={this.state.selectedUser === 'public' ? 'activeRoom' : ''}
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
        {this.listContacts()}
        <h4 style={{
          color: 'grey', marginLeft: '10px', marginBottom: '5px', marginRight: '10px', borderBottom: '1px solid grey',
        }}
        >
          Group chats
        </h4>
      </ul>
    );
  }

  selectPublicChat() {
    if (this.state.selectedUser !== 'public') {
      this.setState({ selectedUser: 'public', sidebar: false, loadedMessages: [] });
    } else {
      this.setState({ selectedUser: 'public', sidebar: false });
    }
  }

  loadMessages() {
    return this.state.loadedMessages.map((chat, index, arr) => {
      if (index === arr.length - 1) {
        return (
          <div className="chatBox" id="last-message">
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
        <div className="chatBox">
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
    });
  }

  sidebarNav() {
    return (
      <div>
        {this.sidebar()}
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
    );
  }

  sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (this.state.selectedUser === 'public' && this.state.message.length > 0) { // send unencrypted message through public channel
      this.socket.current?.emit('public-send', { message: this.state.message });
    } else {
      // encrypt before sending, also check for incoming messages before submition. chat group or individual user
    }
    this.form.current?.reset();
    this.setState({ message: '' });
  }

  render() {
    return (
      <div className="window">
        <Header />
        <div className="window-content">
          <div className="pane-group">
            <div className="hidden">
              <Sidebar
                sidebar={<div className="mobileSideBar">{this.sidebarNav()}</div>}
                open={this.state.sidebar}
                onSetOpen={this.onSetSidebarOpen}
              />
            </div>
            <div className="pane-sm sidebar">
              {this.sidebarNav()}
            </div>
            <div className="pane">
              <button className="hidden sidebarButton" type="button" onClick={() => this.onSetSidebarOpen(true)}>+</button>
              <LogoIntro />
              {this.loadMessages()}
              <form className="message-bar" onSubmit={(e) => this.sendMessage(e)} ref={this.form}>
                <input className="message-bar-input" type="text" onChange={(e) => { this.setState({ message: e.currentTarget.value }); }} placeholder="send a messsage" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
