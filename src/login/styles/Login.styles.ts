import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

const dialButton: TextStyle = {
  fontSize: 28,
  color: '#2d2d2d',
};

const dialButtonContainer: ViewStyle = {
  width: '33%',
  height: '4rem',
  backgroundColor: '#e2e2e2',
  borderColor: 'black',
  borderWidth: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2D2D2D',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
    marginTop: '2rem',
  },
  loginLabel: {
    width: '100%',
    paddingTop: '10%',
    color: 'white',
    textAlign: 'center',
    fontSize: 28,
    marginBottom: '5%',
  },
  usernameInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem',
  },
  usernameInput: {
    textAlign: 'center',
    color: 'white',
    fontSize: 28,
    margin: 0,
    position: 'relative',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  passcodeInputContainer: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: '2%',
  },
  passcodeInput: {
    color: 'white',
    textAlign: 'center',
    fontSize: 28,
    marginHorizontal: 28,
  },
  dialPadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialPad: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 750,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dialButtonContainer,
  dialButtonContainerClear: {
    ...dialButtonContainer,
    backgroundColor: 'red',
  },
  dialButtonContainerSubmit: {
    ...dialButtonContainer,
    backgroundColor: 'green',
  },
  dialButton,
  dialButtonClear: {
    ...dialButton,
  },
  dialButtonSubmit: {
    ...dialButton,
    color: 'white',
  },
});

export default styles;
