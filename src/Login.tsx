import React, { Component } from 'react';
import sha512 from 'crypto-js/sha512';
// @ts-ignore - TS doesn't know about faker for some reason
import faker from 'faker';
import { xor, rounds, conformPlainText } from './crypto/utils';
import { URL } from './App';
import './Login.css';

export const VERIFY_REGEX = /\/\[EXT:.*\]\//;

interface Props {
  approval: (approved: boolean) => void;
}

interface State {
  keyCode: Array<number | null>;
  username: string;
}

class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      keyCode: [],
      username: faker.name.firstName(),
    };
    this.submit = this.submit.bind(this);
    this.approve = this.approve.bind(this);
    this.clearKeys = this.clearKeys.bind(this);
    this.registerKey = this.registerKey.bind(this);
  }

  // Determine whether a encryption token exists
  componentDidMount() {
    let sessionKey = window.sessionStorage.getItem('sessionKey');
    let appKey = window.localStorage.getItem('appKey');
    if (sessionKey && appKey) { // If both exist, then the user is logged in
      const verifyKey = window.localStorage.getItem('verify')?.toString() as string;
      sessionKey = sessionKey.toString();
      appKey = appKey.toString();
      const key = xor(sessionKey, appKey); // get unencrypted csrng key
      const firstRound = rounds(key, 1); // First generation/round
      let verify = xor(verifyKey, firstRound);
      verify = verify.replace(VERIFY_REGEX, '');
      try {
        verify = JSON.parse(verify);
        if (verify) {
          this.approve();
        }
      } catch (err) {
        console.warn('Invalid session --', err);
        this.setState({ keyCode: [] });
      }
    }
  }

  // pass state up
  approve() {
    this.props.approval(true);
  }

  // submit 4 keys and generate encryption tokens || verify existing encryption token
  submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    let appKey = window.localStorage.getItem('appKey');
    if (appKey && this.state.keyCode.length === 4) {
      const sessionHash = sha512(this.state.keyCode.join(''));
      const sessionKey = sessionHash.toString();
      window.sessionStorage.setItem('sessionKey', sessionKey);
      appKey = appKey.toString();
      const verifyKey = window.localStorage.getItem('verify')?.toString() || '';
      const key = xor(sessionKey, appKey); // get unencrypted csrng key
      const firstRound = rounds(key, 1); // First generation/round
      let verify = xor(verifyKey, firstRound);
      verify = verify.replace(VERIFY_REGEX, '');
      try {
        verify = JSON.parse(verify);
        if (verify) {
          this.approve();
        }
      } catch (err) {
        console.warn('Invalid passcode --', err);
        window.sessionStorage.removeItem('sessionKey');
        this.setState({ keyCode: [] });
      }
    } else if (this.state.keyCode.length === 4 && this.state.username.length > 3) {
      const sessionHash = sha512(this.state.keyCode.join(''));
      const sessionKey = sessionHash.toString();
      let csrng = window.crypto.getRandomValues(new Uint32Array(1))[0].toString();
      const csrngHash = sha512(csrng).toString();
      const key = xor(csrngHash, sessionKey);
      const firstRound = rounds(csrngHash, 1); // our rounds are based off the unencrypeted csrng key
      csrng = window.crypto.getRandomValues(new Uint32Array(1))[0].toString();
      const verify = JSON.stringify({
        verify: true,
        username: `${this.state.username}#${csrng.substring(0, 5)}`, // visible rng
        csrng, // stored rng
      });
      const conformText = conformPlainText(verify); // make sure it is 128 chars. long
      const hashedUser = xor(firstRound, conformText);
      fetch(`${URL}/createUser`, {
        method: 'POST',
        body: JSON.stringify({
          user: `${this.state.username}#${csrng.substring(0, 5)}`,
          pass: csrng,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then((_) => {
        window.sessionStorage.setItem('sessionKey', sessionKey);
        window.localStorage.setItem('appKey', key);
        window.localStorage.setItem('verify', hashedUser);
        this.approve();
      }).catch((err) => {
        console.warn(err);
        window.sessionStorage.clear();
        window.localStorage.clear();
        // username taken
      });
    } else {
      this.setState({ keyCode: [] });
    }
  }

  // Determine position of key
  registerKey(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    const { keyCode: keyCodeState } = this.state;
    const value = Number(e.currentTarget.value);

    if (keyCodeState[3] === undefined) {
      if (keyCodeState[2] === undefined) {
        if (keyCodeState[1] === undefined) {
          if (keyCodeState[0] === undefined) {
            this.setState({ keyCode: [value] });
          }
          this.setState({ keyCode: [...keyCodeState, value] });
        }
        this.setState({ keyCode: [...keyCodeState, value] });
      }
      this.setState({ keyCode: [...keyCodeState, value] });
    }
  }

  // clears keys
  clearKeys(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    this.setState({ keyCode: [] });
  }

  render() {
    return (
      <div className="login-screen">
        <h1>Zero Day Messaging</h1>
        {
          window.localStorage.getItem('appKey')
            ? null
            : (
              <input
                id="username-input"
                maxLength={12}
                placeholder="username"
                type="text"
                value={this.state.username}
                onChange={(e) => { this.setState({ username: e.target.value }); }}
              />
            )
        }
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="login-label">Enter Passcode:</label>
        <div className="input-scores">
          <h2 className="input-bar">{this.state.keyCode[0] === undefined ? '_' : '*' }</h2>
          <h2 className="input-bar">{this.state.keyCode[1] === undefined ? '_' : '*' }</h2>
          <h2 className="input-bar">{this.state.keyCode[2] === undefined ? '_' : '*' }</h2>
          <h2 className="input-bar">{this.state.keyCode[3] === undefined ? '_' : '*' }</h2>
        </div>
        <div className="dial-pad">
          <button className="dial-button" type="button" value={1} onClick={this.registerKey}>1</button>
          <button className="dial-button" type="button" value={2} onClick={this.registerKey}>2</button>
          <button className="dial-button" type="button" value={3} onClick={this.registerKey}>3</button>
          <button className="dial-button" type="button" value={4} onClick={this.registerKey}>4</button>
          <button className="dial-button" type="button" value={5} onClick={this.registerKey}>5</button>
          <button className="dial-button" type="button" value={6} onClick={this.registerKey}>6</button>
          <button className="dial-button" type="button" value={7} onClick={this.registerKey}>7</button>
          <button className="dial-button" type="button" value={8} onClick={this.registerKey}>8</button>
          <button className="dial-button" type="button" value={9} onClick={this.registerKey}>9</button>
          <button className="dial-button" type="button" onClick={this.clearKeys} style={{ backgroundColor: 'red' }}>X</button>
          <button className="dial-button" type="button" value={0} onClick={this.registerKey}>0</button>
          <button className="dial-button" type="button" onClick={this.submit} style={{ backgroundColor: 'green' }}>T</button>
        </div>
      </div>
    );
  }
}

export default Login;
