import React from 'react';
import sha512 from 'crypto-js/sha512';
import Xor from './Utility';
import './Login.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key_code_1: null,
            key_code_2: null,
            key_code_3: null,
            key_code_4: null
        }
        this.submit = this.submit.bind(this);
    }

    submit(e) {
        e.preventDefault();
        if(window.localStorage.getItem('setPasscode')) {
            // Login attempt -> llogin funcs
        } else if(this.state.key_code_1 !== null && this.state.key_code_2 !== null && this.state.key_code_3 !== null && this.state.key_code_4 !== null) {
            window.sessionStorage.setItem('sessionKey', sha512(`${this.state.key_code_1}${this.state.key_code_2}${this.state.key_code_3}${this.state.key_code_4}`).toString());
            window.localStorage.setItem('setPasscode', true);
            window.localStorage.setItem('appKey', Xor(sha512(window.crypto.getRandomValues(new Uint32Array(1))[0].toString()).toString(), window.sessionStorage.getItem('sessionKey').toString()));
            this.forceUpdate();
        }
    }

    registerKey(e) {
        e.preventDefault();
        if(this.state.key_code_4 === null) {
            if(this.state.key_code_3 === null) {
                if(this.state.key_code_2 === null) {
                    if(this.state.key_code_1 === null) {
                        return this.setState({ key_code_1: e.currentTarget.value });
                    }
                    return this.setState({ key_code_2: e.currentTarget.value });
                }
                return this.setState({ key_code_3: e.currentTarget.value }); 
            }
            return this.setState({ key_code_4: e.currentTarget.value }); 
        }
    }

    clearKeys(e) {
        e.preventDefault();
        this.setState({
            key_code_1: null,
            key_code_2: null,
            key_code_3: null,
            key_code_4: null
        });
    }

    render () {
        return(
            <div className='login-screen'>
                <label className='login-label'>Enter Passcode:</label>
                <div className="input-scores">
                    <h2 className='input-bar'>{this.state.key_code_1 === null ? '_' : '*' }</h2>
                    <h2 className='input-bar'>{this.state.key_code_2 === null ? '_' : '*' }</h2>
                    <h2 className='input-bar'>{this.state.key_code_3 === null ? '_' : '*' }</h2>
                    <h2 className='input-bar'>{this.state.key_code_4 === null ? '_' : '*' }</h2>
                </div>
                <div className='dial-pad'>
                    <button className='dial-button' defaultValue={1} onClick={(e)=>{ this.registerKey(e) }}>1</button>
                    <button className='dial-button' defaultValue={2} onClick={(e)=>{ this.registerKey(e) }}>2</button>
                    <button className='dial-button' defaultValue={4} onClick={(e)=>{ this.registerKey(e) }}>3</button>
                    <button className='dial-button' defaultValue={5} onClick={(e)=>{ this.registerKey(e) }}>4</button>
                    <button className='dial-button' defaultValue={6} onClick={(e)=>{ this.registerKey(e) }}>5</button>
                    <button className='dial-button' defaultValue={7} onClick={(e)=>{ this.registerKey(e) }}>6</button>
                    <button className='dial-button' defaultValue={8} onClick={(e)=>{ this.registerKey(e) }}>7</button>
                    <button className='dial-button' defaultValue={9} onClick={(e)=>{ this.registerKey(e) }}>8</button>
                    <button className='dial-button' onClick={(e)=>{ this.registerKey(e) }}>9</button>
                    <button className='dial-button' onClick={(e)=>{ this.clearKeys(e) }} style={{backgroundColor:'red'}}>X</button>
                    <button className='dial-button' defaultValue={0} onClick={(e)=>{ this.registerKey(e) }}>0</button>
                    <button className='dial-button' onClick={(e) => { this.submit(e) }} style={{backgroundColor:'green'}}>T</button>
                </div>
            </div>
        );
    }
}

export default Login;