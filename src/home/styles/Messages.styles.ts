// @use '../../photon.scss';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 'auto',
  },
  chatBox: {
    minHeight: 80,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#464646',
    width: '97%',
    margin: 'auto',
    paddingTop: '0.5rem',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  chatImage: {
    width: 50,
    height: 50,
    textAlign: 'center',
    border: '1px solid black',
    borderRadius: 50,
    float: 'left',
    marginLeft: '1%',
    marginTop: 5,
    marginRight: '1rem',
  },
  chatTextContent: {
    width: '85%',
    marginLeft: 5,
    flex: 1,
  },
  chatUsername: {
    marginTop: 3,
    marginBottom: 8,
    fontWeight: 'bold',
    color: 'lightgrey',
  },
  chatMessage: {
    color: 'lightgrey',
    marginBottom: '1rem',
  },
  chatTime: {
    marginBottom: 10,
    fontSize: 12,
    alignSelf: 'flex-end',
    bottom: 0,
    color: 'grey',
  },
});

export default styles;
