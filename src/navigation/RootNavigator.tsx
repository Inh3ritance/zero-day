import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../home';
import Login from '../login';
import DrawerContent from './DrawerContent';

import { appSelectors } from '../app/appSlice';

import { useAppSelector, useMediaQuery } from '../utils/hooks';

import appJson from '../app.json';

///
/// LoggedOutNavigator
///

const Stack = createNativeStackNavigator();

const LoggedOutNavigator = () => (
  <NavigationContainer
    linking={{
      prefixes: ['localhost'],
      config: {
        screens: {
          // Details: 'details',
          // Linking: 'linking',
          Login: '*', // Fall back to if no routes match
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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  </NavigationContainer>
);

///
/// LoggedInNavigator
///

const Drawer = createDrawerNavigator();

const LoggedInNavigator = () => {
  const { isDesktop } = useMediaQuery();
  return (
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
      <Drawer.Navigator
        initialRouteName="Home"
        // eslint-disable-next-line react/no-unstable-nested-components
        drawerContent={(props) => <DrawerContent {...props} />}
        // Need the following to fix an issue with the drawer not closing.
        // https://github.com/react-navigation/react-navigation/issues/10495#issuecomment-1097169259
        useLegacyImplementation
        screenOptions={{
          drawerType: isDesktop ? 'permanent' : 'slide',
        }}
      >
        <Drawer.Screen component={Home} key="Home" name="Home" />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const RootNavigator = () => {
  const isLoggedIn = useAppSelector(appSelectors.isLoggedInSelector);

  return isLoggedIn ? <LoggedInNavigator /> : <LoggedOutNavigator />;
};

export default RootNavigator;
