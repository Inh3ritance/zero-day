import { useEffect } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { MEDIA_QUERY_MAX_WIDTHS } from './constants';

export const useMountEffect = (callback: () => void) => {
  useEffect(callback, []);
};

export const useUnmountEffect = (callback: () => void, dependencies: never[]) => {
  useEffect(() => () => {
    callback();
  }, dependencies);
};

export const useMediaQuery = () => {
  const { width } = useWindowDimensions();
  const {
    mobile: mobileMaxWidth,
    tablet: tabletMaxWidth,
  } = MEDIA_QUERY_MAX_WIDTHS;

  const isMobile = width <= mobileMaxWidth;
  const isTablet = width > mobileMaxWidth && width <= tabletMaxWidth;
  const isDesktop = width > tabletMaxWidth;

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};

const Colors = {
  white: '#fff',
  black: '#000',
  light: '#fafafa',
  dark: '#222',
  lighter: '#f5f5f5',
  darker: '#333',
};

export const useStyles = () => {
  // Dark mode theming items
  const isDarkMode = useColorScheme() === 'dark';
  const accentColor = isDarkMode ? Colors.lighter : Colors.darker;
  const primaryColor = isDarkMode ? Colors.darker : Colors.lighter;
  const backgroundStyle = { backgroundColor: primaryColor, flex: 1 };

  return {
    isDarkMode, accentColor, primaryColor, backgroundStyle,
  };
};
