import React from 'react';

import {
  render, cleanup, fireEvent, act,
} from '../../../lib/test-utils';
import LoginForm, { LOGIN } from '../loginForm';

import { SnackBarContext } from '../../../lib/ui-providers/snackbar';

const mocksItemProps = {
  handleSubmit: jest.fn(),
};

const mocks = [
  {
    request: {
      query: LOGIN,
      variables: { email: 'user@user.com', password: 'test' },
    },
    result: { data: { login: { jwt: 'token' } } },
  },
];

describe('LoginForm', () => {
  afterEach(cleanup);

  const addAlert = jest.fn();

  const { getByTestId } = render(
    <SnackBarContext.Provider value={{ addAlert }}>
      <LoginForm {...mocksItemProps} />
    </SnackBarContext.Provider>, { addTypename: false, mocks },
  );

  it('should log user and receive his token', async () => {
    await act(async () => {
      await fireEvent.change(getByTestId('login-form-email'), { target: { value: 'user@user.com' } });
      expect(getByTestId('login-form-email').value).toBe('user@user.com');
    });


    await act(async () => {
      await fireEvent.change(getByTestId('login-form-password'), { target: { value: 'test' } });
      expect(getByTestId('login-form-password').value).toBe('test');
    });

    // TODO test login & errors
  });
});
