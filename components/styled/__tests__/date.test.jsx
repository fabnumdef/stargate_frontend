import React from 'react';

import { render, cleanup } from '../../../lib/test-utils';
import DatePicker from '../date';

describe('DatePicker', () => {
  afterEach(cleanup);

  it('renders without error', () => {
    render(<DatePicker />);
  });
});
