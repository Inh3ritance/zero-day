import './App.css';
import React from 'react';
import { io } from 'socket.io-client';
import { SecureLink } from 'react-secure-link';
import { Header, LogoIntro } from './statelessComponents/Components';
import Sidebar from 'react-sidebar';
import Popup from 'reactjs-popup';
import Linkify from 'react-linkify';
import default_hidden from './Images/hidden_1.png';
import userInfo from './Utils/getUserInfo';

const url = 'http://localhost:9000';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.socket = React.createRef();
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
        }
      ],
      searchField: '',
      selectedUser: '',
      loadedMessages: [ // encrypted and saved locally
        {
          user: 'rick',
          message: 'ticky whoicky kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj',
          time: 'UTC'
        },
        {
          user: 'rick',
          message: 'schwonk',
          time: '11pm'
        },
        {
          user: 'Inhe',
          message: 'test',
          time: '4am'
        },
      ],
      username: null, // encrypted and saved locally
      csrng: null, // encrypted and saved locally
      sidebar: false,
      socket: null,
    }
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
    this.socket = io(url);
    this.socket.emit('login', { user: this.state.username, pass: this.state.csrng });
    this.socket.on('updateSocket', (data) => {
      this.setState({ socket: data.socket });
    });
    this.socket.on('public-retrieve', (data) => {
      if(this.state.selectedUser === 'public') {
        const prev = this.state.loadedMessages;
        prev.push({ user: 'Anon', message: data.message, time: data.date });
        this.setState({ loadedMessages: prev });
      }
  });
    /*if(indexedDB.open('users').result.objectStoreNames.length <= 0) {
      let db = indexedDB.open('users').result;
      let data = {
        id: '' + 0,
        name: 'kevin',
        key: 'osososos',
        image: '.png',
      }
      db.transaction(['users'], 'readwrite').objectStore('users').add(
        
      );
    }*/
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.selectedUser !== this.state.selectedUser) {
      this.loadMessages(this.state.selectedUser);
    }
  }

  loadMessages() {
    return this.state.loadedMessages.map((chat, index, arr) => {
      if(index === arr.length - 1) {
        return (
          <div className="chatBox" id='last-message'>
            <img className="img-circle media-object" alt={'user'} src={default_hidden} width={'50px'} height={'50px'} style={{ display: 'inline-block', textAlign: 'center', border:'1px solid black', float: 'left', marginLeft: '1%', marginTop: '5px' }}></img>
            <div style={{width:'85%', display: 'inline-block', marginLeft: '5px'}}>
              <p className="chat-username">{chat.user}</p>
              <p><Linkify componentDecorator={(decoratedHref, decoratedText, key) => (<SecureLink href={decoratedHref} key={key}>{decoratedText}</SecureLink>)} className="chat-message">{chat.message}</Linkify></p>
              <p className="chat-time">{chat.time}</p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="chatBox">
            <img className="img-circle media-object" alt={'user'} src={default_hidden} width={'50px'} height={'50px'} style={{ display: 'inline-block', textAlign: 'center', border:'1px solid black', float: 'left', marginLeft: '1%', marginTop: '5px' }}></img>
            <div style={{width:'85%', display: 'inline-block', marginLeft: '5px'}}>
              <p className="chat-username">{chat.user}</p>
              <p><Linkify className="chat-message">{chat.message}</Linkify></p>
              <p className="chat-time">{chat.time}</p>
            </div>
          </div>
        );
      }
    });
  }
  
  selectPublicChat() {
    if(this.state.selectedUser !== 'public') {
      this.setState({ selectedUser: 'public', sidebar: false, loadedMessages: [] });
    } else {
      this.setState({ selectedUser: 'public', sidebar: false });
    }
  }

  sidebar() {
    return(
      <ul className="list-group">
        <li className="list-group-header">
          <div>
            <img className="img-circle media-object activeUser" alt={'user'} src={''} width={'50px'} height={'50px'} style={{ margin: 'auto', display:'block', textAlign: 'center' }}></img>
            <h5 style={{textAlign: 'center', color: 'white', marginTop: '7px', marginBottom: '7px'}}>{this.state.username}</h5>
            <h5 style={{textAlign: 'center', color: 'white', marginTop: '7px', marginBottom: '7px'}}>socket#: {this.state.socket}</h5>
          </div>
          <input className="form-control" type="text" placeholder="Search for someone" onChange={(ev)=>this.setState({ searchField: ev.currentTarget.value })} />
        </li>
        
        <button className="sidebarUserButton" onClick={this.selectPublicChat}><h4 className={this.state.selectedUser === 'public' ? 'activeRoom' : ''} style={{color: 'white'}}>Public chat</h4></button>
        <h4 style={{color: 'grey', marginLeft: '10px', marginBottom: '5px', marginRight: '10px', borderBottom: '1px solid grey'}}>Direct messages</h4>
        <this.listContacts />
        <h4 style={{color: 'grey', marginLeft: '10px', marginBottom: '5px', marginRight: '10px', borderBottom: '1px solid grey'}}>Group chats</h4>
      </ul>
    )
  }

  listContacts() {
    return this.state.friends.map((user) => {
      if (this.state.searchField.length > 0 && user.username.toLowerCase().indexOf(this.state.searchField.toLowerCase()) !== -1) {
        return(
          <button className="sidebarUserButton" onClick={() => this.setState({ selectedUser: user.username, sidebar: false }) }>
            <li className="list-group-item">
              <img alt={'user'} className="img-circle media-object pull-left inActiveUser" src={user.image} width="50px" height="50px" />
              <div className="media-body">
                <strong>{user.username}</strong>
                <p>{user.lastMessage}</p>
              </div>
            </li>
          </button>
        ); 
      } else if (this.state.searchField.length <= 0) {
        return(
          <button className="sidebarUserButton" onClick={() => this.setState({ selectedUser: user.username, sidebar: false })}>
            <li className="list-group-item">
              <img alt={'user'} className="img-circle media-object pull-left inActiveUser" src={user.image} width="50px" height="50px" />
              <div className="media-body">
                <strong>{user.username}</strong>
                <p>{user.lastMessage}</p>
              </div>
            </li>
          </button>
        ); 
      } else {
        return null;
      }
    });
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebar: open });
  }

  sidebarNav() {
    return(
      <div>
        <this.sidebar />
        <Popup modal position={'center'} trigger={<button className='addUser'>+</button>}>
        {
          close => (
            <div className="modal">
              <button className="close" onClick={close}>&times;</button>
              <h3 style={{ color: 'white', textAlign:'center', borderBottom: '1px solid gray', width: '90%', margin:'auto'}}> Create/Join Chatroom </h3>
                <div className="content">
                  <input className='addUserInput' type={'text'} placeholder='secret key'></input>
                  <input className='addUserInput' type={'text'} placeholder='chatroom #'></input>
                  <button id='addUserSubmit' onClick={()=>console.log('submit to server')}>Submit</button>
                </div>      
            </div>    
          )
        }
        </Popup>
      </div>
    );
  }

  sendMessage(e) {
    e.preventDefault();
    if(this.state.selectedUser === 'public' && this.state.message.length > 0) { // send unencrypted message through public channel
      this.socket.emit('public-send', { message: this.state.message });
    } else { // encrypt before sending, also check for incoming messages before submition. chat group or individual user

    }
    this.form.current.reset();
    this.setState({ message: '' });
  } 

  render() {
    return (
      <div className="window">
        <Header />
        <div className="window-content">
          <div className="pane-group">
            <div className='hidden'>
              <Sidebar 
                sidebar={<div className={'mobileSideBar'}>{this.sidebarNav()}</div>}
                open={this.state.sidebar}
                onSetOpen={this.onSetSidebarOpen}
              />
            </div>
            <div className="pane-sm sidebar">
              {
                this.sidebarNav()
              }
            </div>
            <div className="pane">
              <button className='hidden sidebarButton' onClick={() => this.onSetSidebarOpen(true)}>+</button>
              <LogoIntro />
              <this.loadMessages />
              <form className="message-bar" onSubmit={(e)=>this.sendMessage(e)} ref={this.form}>
                <input className="message-bar-input" type='text' onChange={(e)=>{this.setState({ message: e.currentTarget.value })}} placeholder='send a messsage'/>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

export default App;
