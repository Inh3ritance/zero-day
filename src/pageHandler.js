import React from 'react';
import App from './App';
import Login from './Login';

class PageHandler extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            approval: false,
        }
        this.Approved = this.Approved.bind(this);
        this.handlePage = this.handlePage.bind(this);
    }

    Approved(flag) {
        this.setState({
            approval: flag,
        });
    }

    handlePage() {
        if(this.state.approval) {
            return(<App></App>);
        } else {
            return(<Login Approval={()=>this.Approved(true)}></Login>);
        }
    }

    render() {
        return(
            this.handlePage()
        );
    }

}

export default PageHandler;