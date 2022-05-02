import React from 'react';
import Logo from '../assets/images/logo.svg';

const LogoIntro = () => (
  <div style={{ borderBottom: '1px solid #464646', width: '97%', margin: 'auto' }}>
    <img alt="Logo" src={Logo} className="logo-image" />
    <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '2%' }}>Secrecy begins here...</h3>
  </div>
);

export default LogoIntro;
