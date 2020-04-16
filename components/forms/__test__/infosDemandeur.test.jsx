import React from 'react';

import {
  render,
  cleanup,
  fireEvent,
  act,
  waitForElement,
} from '../../../lib/test-utils';
import FormInfosDemandeur from '../infosDemandeur';

const mockItemsPro = {
  formData: {},
  setForm: jest.fn(),
  handleNext: jest.fn(),
  handleBack: jest.fn(),
};

describe('FormInfosDemandeur', () => {
  afterEach(cleanup);

  it('renders without error', () => {
    render(<FormInfosDemandeur dataToProps={mockItemsPro} />);
  });

  it('test validation false', async () => {
    // exception for testing, where props object is define
    // eslint-disable-next-line react/jsx-props-no-spreading
    const { getByText, getByTestId } = render(<FormInfosDemandeur dataToProps={mockItemsPro} />);
    await act(async () => {
      fireEvent.submit(getByTestId(/form-demandeur/i));
    });

    const DateErrorNode = await waitForElement(() => getByText(/la date de début est obligatoire/i));
    expect(DateErrorNode).toBeInTheDocument();

    const LieuxErrorNode = await waitForElement(() => getByText(/la zone est obligatoire/i));
    expect(LieuxErrorNode).toBeInTheDocument();

    expect(mockItemsPro.handleNext).not.toHaveBeenCalled();
  });

  it('test validation true', async () => {
    const { getByTestId, getByLabelText } = render(
      <FormInfosDemandeur dataToProps={mockItemsPro} />,
    );

    await act(async () => {
      fireEvent.click(getByLabelText(/professionnelle/i));
    });
    await act(async () => {
      fireEvent.change(getByTestId(/motif-visite/i), {
        target: { value: 'this is a motif' },
      });
    });
    await act(async () => {
      fireEvent.change(getByTestId(/datedebut-visite/i), {
        target: { value: '24/12/2020' },
      });
    });
    await act(async () => {
      fireEvent.change(getByTestId(/datefin-visite/i), {
        target: { value: '26/12/2020' },
      });
    });
    await act(async () => {
      fireEvent.click(getByTestId(/expand-icon-port militaire/i));
    });

    await act(async () => {
      fireEvent.click(getByTestId(/listitem-port militaire-1/i));
    });
    await act(async () => {
      fireEvent.submit(getByTestId(/form-demandeur/i));
    });

    expect(mockItemsPro.handleNext).toHaveBeenCalled();
  });
});
