import React, { Component } from 'react';
import {
  View, Text, Platform, Button,
} from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './redux/store';
import RootNavigator from './navigation/RootNavigator';
import { appActions } from './app/appSlice';

class App extends Component<{}, { didAppCrash: boolean }> {
  constructor(props: {}) {
    super(props);
    this.reloadApp = this.reloadApp.bind(this);
    this.state = { didAppCrash: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
    this.setState({ didAppCrash: true });
  }

  reloadApp() {
    store.dispatch(appActions.logout());
    persistor.purge();
    this.setState({ didAppCrash: false });
  }

  render() {
    const { didAppCrash } = this.state;

    if (didAppCrash) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Oh no... Something went wrong! :(</Text>
          <Text>
            {`Please ${Platform.OS === 'web' ? 'reload the page' : 'restart the app'}, or contact support if it continues to happen.`}
          </Text>
          <Button title={Platform.OS === 'web' ? 'Reload' : 'Restart'} onPress={this.reloadApp} />
        </View>
      );
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            {/* <TopBar /> */}
            <RootNavigator />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
