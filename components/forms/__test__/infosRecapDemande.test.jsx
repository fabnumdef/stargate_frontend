import React from 'react';

import {
  render, cleanup, fireEvent, act,
} from '../../../lib/test-utils';
import FormInfosRecapDemande from '../infosRecapDemande';

const mockItems = {
  formData: {
    natureVisite: 'Professionnelle',
    dateStartVisite: new Date(2020, 3, 2),
    dateEndVisite: new Date(2020, 3, 3),
    zone1: [{ value: 'MESS' }],
    zone2: [],
    motifVisite: 'un motif convenable',
    listVisiteurs: [
      {
        origineVisiteur: 'MINARM',
        typeVisiteur: 'Militaire actif',
        nidVisiteur: '1111111111',
        gradeVisiteur: 'MP',
        nomNaisanceVisiteur: '',
        prenomVisiteur: 'Robin',
        uniteVisiteur: 'CDBD Toulon',
        emailVisiteur: 'robin.labrouille@intra.go.fr',
        vipVisiteur: 'NON',
        nomDemandeur: '',
        nomVisiteur: 'Labouille',
        nationaliteVisiteur: 'Française',
      },
    ],
  },
  setForm: jest.fn(),
  handleNext: jest.fn(),
  handleBack: jest.fn(),
};

describe('FormInfosRecapDemande', () => {
  afterEach(cleanup);

  it('renders without error', () => {
    render(<FormInfosRecapDemande dataToProps={mockItems} />);
  });

  it('display messages', async () => {
    const { getByText } = render(<FormInfosRecapDemande dataToProps={mockItems} />);

    expect(getByText('Visite du 02/04/2020 au 03/04/2020')).toBeInTheDocument();

    expect(getByText('Motif: un motif convenable')).toBeInTheDocument();
  });

  it('change page when add button', async () => {
    const { getByText } = render(<FormInfosRecapDemande dataToProps={mockItems} />);

    await act(async () => {
      fireEvent.click(getByText(/ajouter/i));
    });

    expect(mockItems.handleBack).toHaveBeenCalled();
  });

  it('display visitor', async () => {
    const { getByText } = render(<FormInfosRecapDemande dataToProps={mockItems} />);

    expect(getByText('MP LABOUILLE Robin')).toBeInTheDocument();
  });
});
