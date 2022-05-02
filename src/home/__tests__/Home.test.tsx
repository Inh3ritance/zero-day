import React from 'react';
import { render } from '@testing-library/react';
import Home from '..';

describe('App', () => {
  it('should render', () => {
    const { getByText } = render(<Home />);
    getByText('We do not listen, we do not hear.');
  });
});
