import { useEffect } from 'react';
import { useMediaQuery as reactUseMediaQuery } from 'react-responsive';

export const useMountEffect = (callback: () => void) => {
  useEffect(callback, []);
};

export const useUnmountEffect = (callback: () => void, dependencies: never[]) => {
  useEffect(() => () => {
    callback();
  }, dependencies);
};

export const useMediaQuery = () => {
  const isMobile = reactUseMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = reactUseMediaQuery({ query: '(min-width: 768px) and (max-width: 1024px)' });
  const isDesktop = reactUseMediaQuery({ query: '(min-width: 1025px)' });

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};
