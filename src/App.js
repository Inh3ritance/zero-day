import './App.css';
import React from 'react';
import sha512 from 'crypto-js/sha512';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      friends: [
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
      loadedMessages: [
        {
          user: 'rick',
          message: 'ticky whoicky kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj',
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
    }
    this.listContacts = this.listContacts.bind(this);
    this.sidebar = this.sidebar.bind(this);
    this.loadMessages = this.loadMessages.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.selectedUser !== this.state.selectedUser) {
      this.loadMessages(this.state.selectedUser);
    }
  }

  loadMessages() {
    return this.state.loadedMessages.map((chat) => {
      return (
        <div className="chatBox">
          <strong className="chat-username">{chat.user}</strong>
          <p className="chat-message">{chat.message}</p>
          <p className="chat-time">{chat.time}</p>
        </div>
      );
    });
  }

  head() {
    return(
      <header className="toolbar toolbar-header">
        <h1 className="title">We do not listen, we do not hear.</h1>
      </header>
    );
  }

  sidebar() {
    return(
      <ul className="list-group">
        <li className="list-group-header">
          <input className="form-control" type="text" placeholder="Search for someone" onChange={(ev)=>this.setState({ searchField: ev.currentTarget.value })} />
        </li>
        <this.listContacts />
      </ul>
    )
  }

  listContacts() {
    return this.state.friends.map((user) => {
      if (this.state.searchField.length > 0 && user.username.toLowerCase().indexOf(this.state.searchField.toLowerCase()) !== -1) {
        return(
          <button className="sidebarUserButton" onClick={() => this.setState({ selectedUser: user.username }) }>
            <li className="list-group-item">
              <img className="img-circle media-object pull-left" src={user.image} width="32" height="32" />
              <div className="media-body">
                <strong>{user.username}</strong>
                <p>{user.lastMessage}</p>
              </div>
            </li>
          </button>
        ); 
      } else if (this.state.searchField.length <= 0) {
        return(
          <button className="sidebarUserButton" onClick={() => this.setState({ selectedUser: user.username })}>
            <li className="list-group-item">
              <img className="img-circle media-object pull-left" src={user.image} width="32" height="32" />
              <div className="media-body">
                <strong>{user.username}</strong>
                <p>{user.lastMessage}</p>
              </div>
            </li>
          </button>
        ); 
      }
    });
  }

  render() {
    return (
      <div className="window">
        <this.head />
        <div className="window-content">
          <div className="pane-group">
            <div className="pane-sm sidebar">
              <this.sidebar />
            </div>
            <div className="pane">
              <this.loadMessages />
              <div className="message-bar">
                <input className="message-bar-input" type='text' placeholder='send a messsage' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

export default App;
