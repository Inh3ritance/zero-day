import React from 'react';
import sha512 from 'crypto-js/sha512';
import { Xor, Rounds, ConformPlainText } from './Utility';
import './Login.css';
import faker from 'faker';

const url = 'http://localhost:9000';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key_code_1: null,
            key_code_2: null,
            key_code_3: null,
            key_code_4: null,
            username: faker.name.firstName(),
        }
        this.submit = this.submit.bind(this);
        this.Approve = this.Approve.bind(this);
    }

    componentDidMount() {
        if(window.sessionStorage.getItem('sessionKey') && window.localStorage.getItem('setPasscode')) {
            const sessionKey = window.sessionStorage.getItem('sessionKey').toString();
            const appKey = window.localStorage.getItem('appKey').toString();
            const verifyKey = window.localStorage.getItem('verify').toString();
            let key = Xor(sessionKey, appKey); // get unencrypted csrng key
            const firstRound = Rounds(key, 1);
            let verify = Xor(verifyKey, firstRound);
            verify = verify.replace(/\/\[EXT:.*\]\//, '');
            try {
                verify = JSON.parse(verify);
                if(verify?.verify) {
                    this.Approve(true);
                }
            } catch(err) {
                console.log(err);
                this.setState({
                    key_code_1: null,
                    key_code_2: null,
                    key_code_3: null,
                    key_code_4: null
                });
            }
        }
    }

    Approve(flag) {
        this.props.Approval(flag);
    }

    submit(e) {
        e.preventDefault();
        if(window.localStorage.getItem('setPasscode') && this.state.key_code_1 !== null && this.state.key_code_2 !== null && this.state.key_code_3 !== null && this.state.key_code_4 !== null) {
            const sessionKey = sha512(`${this.state.key_code_1}${this.state.key_code_2}${this.state.key_code_3}${this.state.key_code_4}`).toString();
            window.sessionStorage.setItem('sessionKey', sessionKey);
            const appKey = window.localStorage.getItem('appKey').toString();
            const verifyKey = window.localStorage.getItem('verify').toString();
            let key = Xor(sessionKey, appKey); // get unencrypted csrng key
            const firstRound = Rounds(key, 1);
            let verify = Xor(verifyKey, firstRound);
            verify = verify.replace(/\/\[EXT:.*\]\//, '');
            try {
                verify = JSON.parse(verify);
                if(verify?.verify) {
                    this.Approve(true);
                }
            } catch(err) {
                console.log(err);
                this.setState({
                    key_code_1: null,
                    key_code_2: null,
                    key_code_3: null,
                    key_code_4: null
                });
            }
        } else if(this.state.key_code_1 !== null && this.state.key_code_2 !== null && this.state.key_code_3 !== null && this.state.key_code_4 !== null && this.state.username.length > 3) {
            const sessionKey = sha512(`${this.state.key_code_1}${this.state.key_code_2}${this.state.key_code_3}${this.state.key_code_4}`).toString();
            const csrng = sha512(window.crypto.getRandomValues(new Uint32Array(1))[0].toString()).toString();
            let key = Xor(csrng, sessionKey);
            const firstRound = Rounds(csrng, 1); // our rounds are based off the unencrypeted csrng key
            const hash = window.crypto.getRandomValues(new Uint32Array(1))[0].toString();
            let verify = JSON.stringify({
                verify: true,
                username: `${this.state.username}#${hash.substring(0,5)}`,
                hash,
            });
            const conformText = ConformPlainText(verify);
            const hashedUser = Xor(firstRound, conformText);
            fetch(`${url}/createUser`, {
                method: "POST",
                body: JSON.stringify({
                    user: `${this.state.username}#${hash.substring(0,5)}`,
                    pass: hash,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(_ => {
                window.sessionStorage.setItem('sessionKey', sessionKey);
                window.localStorage.setItem('setPasscode', true);
                window.localStorage.setItem('appKey', key);
                window.localStorage.setItem('verify', hashedUser);
                this.Approve(true);
            }).catch((err) => {
                console.log(err);
                // username taken
            });
        } else {
            this.setState({
                key_code_1: null,
                key_code_2: null,
                key_code_3: null,
                key_code_4: null
            });
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
                <h1>Zero Day Messaging</h1>
                {
                    window.localStorage.getItem('setPasscode') ? null : <input id='username-input' maxLength={12} placeholder='username' type='text' value={this.state.username} onChange={(e)=>{this.setState({username: e.target.value})}}></input>
                }
                <label className='login-label'>Enter Passcode:</label>
                <div className='input-scores'>
                    <h2 className='input-bar'>{this.state.key_code_1 === null ? '_' : '*' }</h2>
                    <h2 className='input-bar'>{this.state.key_code_2 === null ? '_' : '*' }</h2>
                    <h2 className='input-bar'>{this.state.key_code_3 === null ? '_' : '*' }</h2>
                    <h2 className='input-bar'>{this.state.key_code_4 === null ? '_' : '*' }</h2>
                </div>
                <div className='dial-pad'>
                    <button className='dial-button' value={1} onClick={(e)=>{ this.registerKey(e) }}>1</button>
                    <button className='dial-button' value={2} onClick={(e)=>{ this.registerKey(e) }}>2</button>
                    <button className='dial-button' value={4} onClick={(e)=>{ this.registerKey(e) }}>3</button>
                    <button className='dial-button' value={5} onClick={(e)=>{ this.registerKey(e) }}>4</button>
                    <button className='dial-button' value={6} onClick={(e)=>{ this.registerKey(e) }}>5</button>
                    <button className='dial-button' value={7} onClick={(e)=>{ this.registerKey(e) }}>6</button>
                    <button className='dial-button' value={8} onClick={(e)=>{ this.registerKey(e) }}>7</button>
                    <button className='dial-button' value={9} onClick={(e)=>{ this.registerKey(e) }}>8</button>
                    <button className='dial-button' onClick={(e)=>{ this.registerKey(e) }}>9</button>
                    <button className='dial-button' onClick={(e)=>{ this.clearKeys(e) }} style={{backgroundColor:'red'}}>X</button>
                    <button className='dial-button' value={0} onClick={(e)=>{ this.registerKey(e) }}>0</button>
                    <button className='dial-button' onClick={(e) => { this.submit(e) }} style={{backgroundColor:'green'}}>T</button>
                </div>
            </div>
        );
    }
}

export default Login;