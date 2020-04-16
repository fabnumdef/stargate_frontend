import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render, cleanup } from '../../../lib/test-utils';

import MenuIcon from '../header/menuIcon';

describe('<MenuIcon /> tests', () => {
  afterEach(cleanup);

  it('should click on the icon and render the menu item', () => {
    const { getByTitle, getByRole } = render(<MenuIcon />);
    const clickOnIcon = getByRole('button');
    fireEvent.click(clickOnIcon);
    expect(getByTitle('myAccount')).toBeVisible();
  });

  it('should render MenuIcon', () => {
    render(<MenuIcon />);
  });
});
