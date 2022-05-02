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
    this.approved = this.approved.bind(this);
    this.handlePage = this.handlePage.bind(this);
  }

  handlePage() {
    if (this.state.approval) {
      return (<Home />);
    }
    return (<Login approval={(appr: boolean) => this.approved(appr)} />);
  }

  approved(flag: boolean) {
    this.setState({
      approval: flag,
    });
  }

  render() {
    return (this.handlePage());
  }
}

export default App;
