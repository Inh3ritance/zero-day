import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';

// import Icon from 'react-native-vector-icons/FontAwesome';
import Home from './home';
import Login from './login';

import { useMediaQuery } from './utils/hooks';

import appJson from './app.json';

const App = () => {
  const [approval, setApproval] = useState(false);

  const approve = useCallback(() => {
    setApproval(true);
  }, [setApproval]);

  return approval ? <Home /> : <Login approve={approve} />;
};

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => (
  <DrawerContentScrollView>
    {/* Placeholder view for now */}
    <View style={{ height: 100, width: 500, backgroundColor: 'red' }} />
  </DrawerContentScrollView>
);

const DrawerNavigator = () => {
  const { isDesktop } = useMediaQuery();
  return (
    <Drawer.Navigator
      initialRouteName="App"
      drawerContent={CustomDrawerContent}
      // Need the following to fix an issue with the drawer not closing.
      // https://github.com/react-navigation/react-navigation/issues/10495#issuecomment-1097169259
      useLegacyImplementation
      screenOptions={{
        drawerType: isDesktop ? 'permanent' : 'slide',
      }}
    >
      <Drawer.Screen component={App} key="App" name="App" />
    </Drawer.Navigator>
  );
};

const RootNavigator = () => (
  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
    {/* <TopBar /> */}
    <NavigationContainer
      linking={{
        prefixes: ['localhost'],
        config: {
          screens: {
            // Details: 'details',
            // Linking: 'linking',
            Home: '*', // Fall back to if no routes match
          },
        },
      }}
      documentTitle={{
        formatter: (options, route) => `${appJson.displayName}${
          options?.title || route?.name
            ? ` - ${options?.title}` ?? route?.name
            : ' '
        }`,
      }}
    >
      <DrawerNavigator />
    </NavigationContainer>
  </SafeAreaProvider>
);

export default RootNavigator;
