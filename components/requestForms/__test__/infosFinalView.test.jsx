import React from 'react';

import {
  render, cleanup, fireEvent, act,
} from '../../../lib/test-utils';
import FormInfosRecapDemande from '../infosFinalView';

const mockItems = {
  formData: {
    object: 'PROFESSIONAL',
    visitors: [],
    place: [],
    from: new Date(),
    to: new Date(),
    reason: 'A reason !',
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

    expect(getByText('Visite du 02/04/2020 au 03/04/2020')).toBeInTheDocument();

    expect(getByText('Motif: un motif convenable')).toBeInTheDocument();
  });

  it('change page when add button', async () => {
    const { getByText } = render(<FormInfosRecapDemande {...mockItems} />);

    await act(async () => {
      fireEvent.click(getByText(/ajouter/i));
    });

    expect(mockItems.handleBack).toHaveBeenCalled();
  });

  // it('display visitor', async () => {
  //   const { getByText } = render(<FormInfosRecapDemande {...mockItems} />);

  //   expect(getByText('MP LABOUILLE Robin')).toBeInTheDocument();
  // });
});
