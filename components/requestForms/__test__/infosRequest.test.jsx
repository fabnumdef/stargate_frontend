import React from 'react';

import {
  render,
  cleanup,
  fireEvent,
  act,
  waitForElement,
} from '../../../lib/test-utils';
import FormInfosClaimant from '../infosRequest';

import { SnackBarContext } from '../../../lib/ui-providers/snackbar';
import { LoginContext } from '../../../lib/loginContext';

const mockItemsPro = {
  formData: {},
  setForm: jest.fn(),
  handleNext: jest.fn(),
  handleBack: jest.fn(),
};

describe('FormInfosClaimant', () => {
  afterEach(cleanup);

  const addAlert = jest.fn();
  const activeRole = { role: 'role', unit: 'unit' };

  it('renders without error', () => {
    render(
      <LoginContext.Provider value={{ activeRole }}>
        <SnackBarContext.Provider value={{ addAlert }}>
          <FormInfosClaimant {...mockItemsPro} />
        </SnackBarContext.Provider>
      </LoginContext.Provider>,
    );
  });

  it('test validation false', async () => {
    // exception for testing, where props object is define
    const { getByText, getByTestId } = render(
      <LoginContext.Provider value={{ activeRole }}>
        <SnackBarContext.Provider value={{ addAlert }}>
          <FormInfosClaimant {...mockItemsPro} />
        </SnackBarContext.Provider>
      </LoginContext.Provider>,
    );
    await act(async () => {
      fireEvent.submit(getByTestId(/form-demandeur/i));
    });

    const DateErrorNode = await waitForElement(() => getByText(/la date de début est obligatoire/i));
    expect(DateErrorNode).toBeInTheDocument();

    const LieuxErrorNode = await waitForElement(() => getByText(/Le choix d'un lieu est obligatoire/i));
    expect(LieuxErrorNode).toBeInTheDocument();

    expect(mockItemsPro.handleNext).not.toHaveBeenCalled();
  });
});
