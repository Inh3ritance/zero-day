import React from 'react';
import App from './App';
import Login from './Login';

interface State {
  approval: boolean;
}

class PageHandler extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      approval: false,
    };
    this.approved = this.approved.bind(this);
    this.handlePage = this.handlePage.bind(this);
  }
  
  approved(flag: boolean) {
    this.setState({
      approval: flag,
    });
  }
  
  handlePage() {
    if(this.state.approval) {
      return (<App />);
    } else {
      return (<Login approval={(appr: boolean)=> this.approved(appr)} />);
    }
  }
  
  render() {
    return (this.handlePage());
  }
}

export default PageHandler;
