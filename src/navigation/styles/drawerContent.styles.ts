import { StyleSheet } from 'react-native';

// const backgroundColor = '#383838';

const styles = StyleSheet.create({
  paneGroup: {
    backgroundColor: '#2D2D2D',
    width: '100%',
  },
  activeRoom: {
    color: 'green',
  },
  listGroupItem: {
    flexDirection: 'row',
    borderBottomColor: '#2D2D2D',
    borderBottomWidth: 1,
  },
  imgCircle: {
    borderRadius: 50,
  },
  mediaBody: {
    overflow: 'hidden',
  },
  mediaObject: {
    marginTop: 3,
  },
  mediaObjectPullLeft: {
    marginRight: 10,
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
  sidebarUserButton: {
    width: '95%',
    backgroundColor: '#2e2e2e',
    border: '1px solid rgb(165, 165, 165)',
    position: 'relative',
  },
  sidebar: {
    height: '100%',
    width: '100%',
    border: 'none',
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
});

export default styles;
