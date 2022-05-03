import React, { Component } from 'react';
import sha512 from 'crypto-js/sha512';
// @ts-ignore - TS doesn't know about faker for some reason
import faker from 'faker';
import { xor, rounds, conformPlainText } from '../crypto/utils';
import { VERIFY_REGEX } from '../utils/constants';
import { createUserRequest } from './api';
import { CREATE_USER_ERROR } from './constants';
import './styles/Login.css';

interface Props {
  approve: () => void;
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
    this.clearKeys = this.clearKeys.bind(this);
    this.registerKey = this.registerKey.bind(this);
  }

  // Determine whether a encryption token exists
  componentDidMount() {
    const sessionKey = window.sessionStorage.getItem('sessionKey');
    const appKey = window.localStorage.getItem('appKey');
    if (sessionKey && appKey) { // If both exist, then the user is logged in
      this.login(appKey, sessionKey);
    }
  }

  async createUser() {
    const { username } = this.state;
    const { approve } = this.props;

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

    const { status } = await createUserRequest(username, csrng);
    if (status === 200) {
      window.sessionStorage.setItem('sessionKey', sessionKey);
      window.localStorage.setItem('appKey', key);
      window.localStorage.setItem('verify', hashedUser);
      approve();
    } else {
      // username taken
      console.warn(CREATE_USER_ERROR);
      window.sessionStorage.clear();
      window.localStorage.clear();
    }
  }

  login(appKey: string, sessionKey: string) {
    const { approve } = this.props;

    const verifyKey = window.localStorage.getItem('verify')?.toString() as string;
    const key = xor(sessionKey, appKey); // get unencrypted csrng key
    const firstRound = rounds(key, 1); // First generation/round
    let verify = xor(verifyKey, firstRound);
    verify = verify.replace(VERIFY_REGEX, '');
    try {
      verify = JSON.parse(verify);
      if (verify) {
        approve();
      }
    } catch (err) {
      console.warn('Invalid session --', err);
      window.sessionStorage.removeItem('sessionKey');
      this.setState({ keyCode: [] });
    }
  }

  // submit 4 keys and generate encryption tokens || verify existing encryption token
  submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    const appKey = window.localStorage.getItem('appKey');

    if (appKey && this.state.keyCode.length === 4) {
      const sessionHash = sha512(this.state.keyCode.join(''));
      const sessionKey = sessionHash.toString();
      window.sessionStorage.setItem('sessionKey', sessionKey);

      this.login(appKey, sessionKey);
    } else if (this.state.keyCode.length === 4 && this.state.username.length > 3) {
      this.createUser();
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
