import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render, cleanup } from '../../../lib/test-utils';

import MenuIcon from '../header/menuIcon';

import { LoginContext } from '../../../lib/loginContext';

describe('<MenuIcon /> tests', () => {
  afterEach(cleanup);
  const signOut = jest.fn();

  it('should click on the icon and render the menu item', () => {
    const { getByTitle, getByRole } = render(
      <LoginContext.Provider value={{ signOut }}><MenuIcon /></LoginContext.Provider>,
    );
    const clickOnIcon = getByRole('button');
    fireEvent.click(clickOnIcon);
    expect(getByTitle('myAccount')).toBeVisible();
  });

  it('should render MenuIcon', () => {
    render(<LoginContext.Provider value={{ signOut }}><MenuIcon /></LoginContext.Provider>);
  });
});
