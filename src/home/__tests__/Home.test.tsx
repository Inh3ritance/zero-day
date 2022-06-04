import React from 'react';
import { render } from '@testing-library/react';
import Home from '..';

// jsdom doesn't implement `scrollIntoView` so we mock it here for tests
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('App', () => {
  it('should render', () => {
    const { getByTestId } = render(<Home />);
    getByTestId('Home');
  });
});
