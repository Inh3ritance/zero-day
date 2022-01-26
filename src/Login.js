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

    // Determine whether a encryption token exists
    componentDidMount() {
        let sessionKey = window.sessionStorage.getItem('sessionKey');
        let appKey = window.localStorage.getItem('appKey');
        if(sessionKey && appKey) {
            const verifyKey = window.localStorage.getItem('verify').toString();
            sessionKey = sessionKey.toString();
            appKey = appKey.toString();
            const key = Xor(sessionKey, appKey); // get unencrypted csrng key
            const firstRound = Rounds(key, 1); // First generation/round
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

    // pass state up
    Approve(flag) {
        this.props.Approval(flag);
    }

    // submit 4 keys and generate encryption tokens || verify existing encryption token
    submit(e) {
        e.preventDefault();
        let appKey = window.localStorage.getItem('appKey');
        if(appKey && this.state.key_code_1 && this.state.key_code_2 && this.state.key_code_3 && this.state.key_code_4) {
            const sessionHash = sha512(`${this.state.key_code_1}${this.state.key_code_2}${this.state.key_code_3}${this.state.key_code_4}`);
            const sessionKey = sessionHash.toString();
            window.sessionStorage.setItem('sessionKey', sessionKey);
            appKey = appKey.toString();
            const verifyKey = window.localStorage.getItem('verify').toString();
            let key = Xor(sessionKey, appKey); // get unencrypted csrng key
            const firstRound = Rounds(key, 1); // First generation/round
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
        } else if(this.state.key_code_1 && this.state.key_code_2 && this.state.key_code_3 && this.state.key_code_4 && this.state.username.length > 3) {
            const sessionHash = sha512(`${this.state.key_code_1}${this.state.key_code_2}${this.state.key_code_3}${this.state.key_code_4}`); 
            const sessionKey = sessionHash.toString();
            let csrng = window.crypto.getRandomValues(new Uint32Array(1))[0].toString();
            const csrngHash = sha512(csrng).toString();
            let key = Xor(csrngHash, sessionKey);
            const firstRound = Rounds(csrngHash, 1); // our rounds are based off the unencrypeted csrng key
            csrng = window.crypto.getRandomValues(new Uint32Array(1))[0].toString();
            let verify = JSON.stringify({
                verify: true,
                username: `${this.state.username}#${csrng.substring(0,5)}`, // visible rng
                csrng, // stored rng
            });
            const conformText = ConformPlainText(verify); // make sure it is 128 chars. long
            const hashedUser = Xor(firstRound, conformText);
            fetch(`${url}/createUser`, {
                method: "POST",
                body: JSON.stringify({
                    user: `${this.state.username}#${csrng.substring(0,5)}`,
                    pass: csrng,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(_ => {
                window.sessionStorage.setItem('sessionKey', sessionKey);
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

    // Determine position of key
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

    // clears keys
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
                    window.localStorage.getItem('appKey') ? null : <input id='username-input' maxLength={12} placeholder='username' type='text' value={this.state.username} onChange={(e)=>{this.setState({username: e.target.value})}}></input>
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