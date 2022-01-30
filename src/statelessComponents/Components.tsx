import React from 'react';
import Logo from '../logo.svg';

function Header() {
  return (
    <header className="toolbar toolbar-header">
      <h1 className="title">We do not listen, we do not hear.</h1>
    </header>
  );
}

function LogoIntro() {
  return (
    <div style={{ borderBottom: '1px solid #464646', width: '97%', margin: 'auto' }}>
      <img alt="Logo" src={Logo} className="logo-image" />
      <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '2%' }}>Secrecy begins here...</h3>
    </div>
  );
}

export {
  LogoIntro,
  Header,
};
