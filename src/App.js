import './App.css';
import React from 'react';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.head = this.head.bind();
  }

  head() {
    return(
      <header className="toolbar toolbar-header">
        <h1 className="title">We do not listen, we do not hear.</h1>
      </header>
    );
  }

  render() {
    return (
      <div class="window">
        <this.head/>
      <div className="window-content">
      <div className="pane-group">
        <div className="pane-sm sidebar">
        <ul className="list-group">
          <li className="list-group-header">
            <input className="form-control" type="text" placeholder="Search for someone" />
          </li>
          <li className="list-group-item">
            <img className="img-circle media-object pull-left" src="/assets/img/avatar.jpg" width="32" height="32" />
            <div className="media-body">
              <strong>List item title</strong>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </li>
          <li className="list-group-item">
            <img className="img-circle media-object pull-left" src="/assets/img/avatar2.png" width="32" height="32" />
            <div className="media-body">
              <strong>List item title</strong>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </li>
        </ul>
        </div>
        <div className="pane" >
          <div className="message-bar">
            <input className="message-bar-input" type='text' placeholder='send a messsage'>
            </input>
          </div>
        </div>
      </div>
      </div>
      </div>
    );
  }
  
}

export default App;
