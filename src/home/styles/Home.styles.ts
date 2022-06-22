// @use '../../photon.scss';
import { StyleSheet } from 'react-native';
import { MESSAGE_BAR_HEIGHT } from '../constants';

const backgroundColor = '#383838';

const styles = StyleSheet.create({
  paneGroup: {
    backgroundColor: '#2D2D2D',
    width: '100%',
  },
  activeRoom: {
    color: 'green',
  },
  listGroupItem: {
    borderBottomColor: '#2D2D2D',
    borderBottomWidth: 1,
  },
  imgCircle: {
    borderRadius: 50,
  },
  mediaObject: {
    marginTop: 3,
  },
  mediaObjectPullLeft: {
    marginRight: 10,
  },
  mediaBody: {
    overflow: 'hidden',
  },
  listGroup: {
    width: '100%',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  listGroupHeader: {
    padding: 10,
  },
  logoImage: {
    height: 400,
    width: '100%',
    textAlign: 'center',
    margin: 'auto',
    position: 'relative',
  },
  window: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    backgroundColor,
  },
  windowContent: {
    display: 'flex',
    flex: 1,
  },
  pane: {
    backgroundColor,
    borderLeftWidth: 0,
    width: '80%',
  },
  formControl: {
    backgroundColor: '#383838',
    border: '1px solid #11f1f',
    color: 'white',
  },
  messageBarSpacer: {
    height: MESSAGE_BAR_HEIGHT,
  },
  messageBar: {
    width: '100%',
    height: MESSAGE_BAR_HEIGHT,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#383838',
  },
  messageBarInputText: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: '#2D2D2D',
    color: 'white',
    borderColor: 'grey',
    borderWidth: 2,
    borderRadius: 5,
  },
  sidebarUserButton: {
    width: '95%',
    backgroundColor: '#2e2e2e',
    border: '1px solid rgb(165, 165, 165)',
    position: 'relative',
  },
  /*
  .sidebarUserButton:hover {
    background-color: #272727;
  }
  */
  addUser: {
    marginTop: '5%',
    borderRadius: 50,
    width: 40,
    position: 'relative',
    left: '40%',
    fontSize: 'large',
    height: 40,
    color: 'white',
  },
  modal: {
    margin: 'auto',
    backgroundColor: 'rgb(26, 26, 26)',
    borderRadius: 3,
    border: '2px solid rgb(47, 47, 47)',
  },
  close: {
    position: 'relative',
    paddingVertical: 2,
    paddingHorizontal: 5,
    lineHeight: 20,
    right: 10,
    top: -10,
    fontSize: 24,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    border: '2px solid #cfcece',
  },
  addUserInput: {
    width: '90%',
    padding: '2%',
    marginBottom: '5%',
  },
  addUserSubmit: {
    textAlign: 'center',
    width: '40%',
    marginBottom: '5%',
  },
  sidebar: {
    width: 200,
    height: '100%',
    backgroundColor: '#1f1f1f',
  },
  paneSmall: {
    width: 200,
    height: '100%',
    backgroundColor: '#1f1f1f',
  },
  sidebarButton: {
    position: 'absolute',
    top: 25,
    backgroundColor: '#1f1f1f',
    textAlign: 'center',
    color: 'white',
    border: 'none',
    zIndex: 1,
    width: 25,
    height: 25,
    borderRightWidth: 2,
    borderRightColor: 'rgb(0. 66. 110)',
  },
  activeUser: {
    border: '1px solid rgb(0, 214, 0)',
    boxShadow: '0 0 1px #9ecaed',
    overflow: 'visible',
  },
  inActiveUser: {
    border: '1px solid rgb(255, 52, 52)',
    boxShadow: '0 0 1px #7195b3',
    overflow: 'visible',
  },
  // @media screen and (min-width: 768px) {
  //   .pane-sm, .sidebar {
  //     width: 100%;
  //   }
  // }

  // @media screen and (width < 550px) {
  //   .message-bar-input {
  //     width: 95%;
  //   }
  // }
});

export default styles;
