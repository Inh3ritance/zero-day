import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles/Home.styles';

const LogoIntro = () => (
  <View style={{
    borderBottomWidth: 1,
    borderBottomColor: '#464646',
    width: '97%',
    margin: 'auto',
    marginTop: '2rem',
  }}
  >
    {/* <Logo /> */}
    <Text style={{
      color: 'white',
      textAlign: 'center',
      fontSize: 24,
      marginBottom: '2%',
    }}
    >
      Secrecy begins here...
    </Text>
  </View>
);

export default LogoIntro;
