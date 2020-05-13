import React from 'react';

import {
  render,
  cleanup,
  fireEvent,
  act,
  // waitForElement,
} from '../../../lib/test-utils';
import FormInfosVisiteurs from '../infosVisitor';

import { SnackBarContext } from '../../../lib/ui-providers/snackbar';

const mockItemsPro = {
  formData: {
    object: 'PROFESSIONAL',
    visitors: [],
    place: [],
    from: new Date(),
    to: new Date(),
    reason: 'A reason !',
  },
  setForm: jest.fn(),
  handleNext: jest.fn(),
  handleBack: jest.fn(),
};


// eslint-disable-next-line no-unused-vars
const mockItemsPri = {
  formData: {
    object: 'PRIVATE',
    visitors: [],
    place: [],
    from: new Date(),
    to: new Date(),
    reason: 'A reason !',
  },
  setForm: jest.fn(),
  handleNext: jest.fn(),
  handleBack: jest.fn(),
};

// eslint-disable-next-line no-unused-vars
const mockItemsProDga = {
  formData: {
    object: 'PROFESSIONAL',
    visitors: [],
    place: ['ILOT SUD'],
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

  // it('display the good components if nature of visit is privee', () => {
  //   const { getByText } = render(
  //     <SnackBarContext.Provider value={{ addAlert }}>
  //       <FormInfosVisiteurs {...mockItemsPri} />
  //     </SnackBarContext.Provider>,
  //   );

  //   expect(getByText('Lien du demandeur')).toBeVisible();
  // });

  it('display the good list if user from minarm', async () => {
    const { getByText, getByTestId } = render(
      <SnackBarContext.Provider value={{ addAlert }}>
        <FormInfosVisiteurs {...mockItemsPro} />
      </SnackBarContext.Provider>,
    );

    await act(async () => {
      fireEvent.click(getByTestId(/minarm-button/i));
    });

    await act(async () => {
      fireEvent.mouseDown(getByTestId(/list-employe/i));
    });

    expect(getByText(/réserviste/i)).toBeVisible();
  });

  it('display the good list if user not from minarm', async () => {
    const { getByText, getByLabelText, getByTestId } = render(
      <SnackBarContext.Provider value={{ addAlert }}>
        <FormInfosVisiteurs {...mockItemsPro} />
      </SnackBarContext.Provider>,
    );

    await act(async () => {
      fireEvent.click(getByLabelText(/hors minarm/i));
    });

    await act(async () => {
      fireEvent.mouseDown(getByTestId(/list-employe/i));
    });

    expect(getByText(/stagiaire/i)).toBeVisible();
  });

  // it('test validation false', async () => {
  //   const { getByText, getByTestId } = render(
  //     <SnackBarContext.Provider value={{ addAlert }}>
  //       <FormInfosVisiteurs {...mockItemsPro} />
  //     </SnackBarContext.Provider>,
  //   );

  //   await act(async () => {
  //     fireEvent.submit(getByTestId(/form-visiteur/i));
  //   });

  //   const EmailErrorNode =
  // await waitForElement(() => getByText(/L'email du visiteur est obligatoire/i));

  //   expect(EmailErrorNode).toBeInTheDocument();

  //   const PrenomErrorNode = await waitForElement(() => getByText(/Le prénom est oblitoire/i));
  //   expect(PrenomErrorNode).toBeInTheDocument();

  //   expect(mockItemsPro.handleNext).not.toHaveBeenCalled();
  // });

  // it('test validation of form for min-arm true', async () => {
  //   const { getByTestId, getByText } = render(
  //     <SnackBarContext.Provider value={{ addAlert }}>
  //       <FormInfosVisiteurs {...mockItemsPro} />
  //     </SnackBarContext.Provider>,
  //   );

  //   await act(async () => {
  //     fireEvent.click(getByTestId(/minarm-button/i));
  //   });

  //   await act(async () => {
  //     fireEvent.mouseDown(getByTestId(/list-employe/i));
  //   });

  //   await act(async () => {
  //     fireEvent.click(getByText(/réserviste/i));
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-nomUsage/i), {
  //       target: { value: 'Rambo' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-nomNaissance/i), {
  //       target: { value: 'Rambo' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-nid/i), {
  //       target: { value: '11111111111' },
  //     });
  //   });
  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-grade/i), {
  //       target: { value: 'Sergent' },
  //     });
  //   });
  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-unite/i), {
  //       target: { value: '1st' },
  //     });
  //   });
  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-prenom/i), {
  //       target: { value: 'John' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-email/i), {
  //       target: { value: 'bon.jour@gmail.com' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.submit(getByTestId(/form-visiteur/i));
  //   });

  //   expect(mockItemsPro.handleNext).toHaveBeenCalled();
  // });

  // it('test validation form true for visiting DGA zone true', async () => {
  //   const { getByTestId, getByText } = render(
  //     <SnackBarContext.Provider value={{ addAlert }}>
  //       <FormInfosVisiteurs {...mockItemsProDga} />
  //     </SnackBarContext.Provider>,
  //   );

  //   await act(async () => {
  //     fireEvent.click(getByTestId(/minarm-button/i));
  //   });

  //   await act(async () => {
  //     fireEvent.mouseDown(getByTestId(/list-employe/i));
  //   });

  //   await act(async () => {
  //     fireEvent.click(getByText(/réserviste/i));
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-nomUsage/i), {
  //       target: { value: 'Rambo' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-nomNaissance/i), {
  //       target: { value: 'Rambo' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-nid/i), {
  //       target: { value: '11111111111' },
  //     });
  //   });
  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-grade/i), {
  //       target: { value: 'Sergent' },
  //     });
  //   });
  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-unite/i), {
  //       target: { value: '1st' },
  //     });
  //   });
  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-prenom/i), {
  //       target: { value: 'John' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-email/i), {
  //       target: { value: 'bon.jour@gmail.com' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-refHabilitation/i), {
  //       target: { value: '007' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-dateFinHabilitation/i), {
  //       target: { value: '30/10/2025' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-refControleElementaire/i), {
  //       target: { value: '00007' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.change(getByTestId(/visiteur-dateDemandeControle/i), {
  //       target: { value: '30/10/2021' },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.submit(getByTestId(/form-visiteur/i));
  //   });

  //   expect(mockItemsProDga.handleNext).toHaveBeenCalled();
  // });
});
