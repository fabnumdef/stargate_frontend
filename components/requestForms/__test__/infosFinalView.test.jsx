import React from 'react';

import {
  render, cleanup,
} from '../../../lib/test-utils';
import FormInfosRecapDemande from '../infosFinalView';

import { SnackBarContext } from '../../../lib/ui-providers/snackbar';

const mockItems = {
  formData: {
    object: 'PROFESSIONAL',
    visitors: [
      {
        nid: '1',
        firstname: 'John',
        birthLastname: 'RAMBO',
        usageLastname: 'RAMBO',
        rank: 'SGT',
        company: 'La7',
        email: 'ok@ok.com',
      },
    ],
    places: [],
    from: new Date(),
    to: new Date(),
    reason: 'un motif convenable',
  },
  setForm: jest.fn(),
  handleBack: jest.fn(),
};

describe('FormInfosRecapDemande', () => {
  afterEach(cleanup);

  const addAlert = jest.fn();

  it('renders without error', () => {
    render(
      <SnackBarContext.Provider value={{ addAlert }}>
        <FormInfosRecapDemande {...mockItems} />
      </SnackBarContext.Provider>,
    );
  });

  it('display messages', async () => {
    const { getByText } = render(
      <SnackBarContext.Provider value={{ addAlert }}>
        <FormInfosRecapDemande {...mockItems} />
      </SnackBarContext.Provider>,
    );

    expect(getByText('Motif: un motif convenable')).toBeInTheDocument();
  });
});
