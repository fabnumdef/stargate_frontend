import React from 'react';

import {
  render,
  cleanup,
} from '../../../lib/test-utils';
import FormInfosVisiteurs from '../infosVisitor';

import { SnackBarContext } from '../../../lib/ui-providers/snackbar';

const mockItemsPro = {
  formData: {
    object: 'PROFESSIONAL',
    visitors: [],
    places: [],
    from: new Date(),
    to: new Date(),
    reason: 'A reason !',
  },
  setForm: jest.fn(),
  handleNext: jest.fn(),
  handleBack: jest.fn(),
};


describe('FormInfosVisiteurs', () => {
  afterEach(cleanup);

  const addAlert = jest.fn();

  it('renders without error', () => {
    render(
      <SnackBarContext.Provider value={{ addAlert }}>
        <FormInfosVisiteurs {...mockItemsPro} />
      </SnackBarContext.Provider>,
    );
  });

  it('display the good components if nature of visit is pro', () => {
    const { getByText } = render(
      <SnackBarContext.Provider value={{ addAlert }}>
        <FormInfosVisiteurs {...mockItemsPro} />
      </SnackBarContext.Provider>,
    );

    expect(getByText('Origine visiteurs')).toBeVisible();
  });
});
