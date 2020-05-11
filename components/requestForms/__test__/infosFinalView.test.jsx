import React from 'react';

import {
  render, cleanup, fireEvent, act,
} from '../../../lib/test-utils';
import FormInfosRecapDemande from '../infosFinalView';

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
    place: [],
    from: new Date(),
    to: new Date(),
    reason: 'un motif convenable',
  },
  setForm: jest.fn(),
  handleBack: jest.fn(),
};

describe('FormInfosRecapDemande', () => {
  afterEach(cleanup);

  it('renders without error', () => {
    render(<FormInfosRecapDemande {...mockItems} />);
  });

  it('display messages', async () => {
    const { getByText } = render(<FormInfosRecapDemande {...mockItems} />);

    expect(getByText('Motif: un motif convenable')).toBeInTheDocument();
  });


  // it('display visitor', async () => {
  //   const { getByText } = render(<FormInfosRecapDemande {...mockItems} />);

  //   expect(getByText('MP LABOUILLE Robin')).toBeInTheDocument();
  // });
});
