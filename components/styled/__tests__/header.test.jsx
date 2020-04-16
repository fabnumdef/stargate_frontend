import React from 'react';
import preloadAll from 'jest-next-dynamic';

import { render, cleanup, waitForElement } from '../../../lib/test-utils';
import Header from '../header';

describe('Header', () => {
  afterEach(cleanup);

  it('render without user', async () => {
    await preloadAll();
    const { getByText } = render(<Header userLogged />);
    const lazyContent = await waitForElement(() => getByText(/MP Durand Henri/));
    expect(lazyContent).toBeInTheDocument();
  });
});
