import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render', () => {
    const { getByText } = render(<App />);
    getByText('We do not listen, we do not hear.');
  });
});
