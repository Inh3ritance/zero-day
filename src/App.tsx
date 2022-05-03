import React from 'react';
import Home from './home';
import Login from './login';

interface State {
  approval: boolean;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      approval: false,
    };
    this.approve = this.approve.bind(this);
  }

  approve() {
    this.setState({
      approval: true,
    });
  }

  render() {
    if (this.state.approval) {
      return (<Home />);
    }
    return (<Login approve={this.approve} />);
  }
}

export default App;
