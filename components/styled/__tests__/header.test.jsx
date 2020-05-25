import React from 'react';
import preloadAll from 'jest-next-dynamic';

import { render, cleanup, waitForElement } from '../../../lib/test-utils';
import Header from '../header';
import { LoginContext } from '../../../lib/loginContext';

describe('Header', () => {
  afterEach(cleanup);
  const signOut = jest.fn();

  it('render without user', async () => {
    await preloadAll();
    const { getByText } = render(
      <LoginContext.Provider value={{ signOut }}><Header /></LoginContext.Provider>,
    );
    const lazyContent = await waitForElement(() => getByText(/MP Durand Henri/));
    expect(lazyContent).toBeInTheDocument();
  });
});
