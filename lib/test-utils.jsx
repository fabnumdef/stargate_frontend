import React from 'react';
// disable eslint - this imports are good for tests, but not in a test file
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
// this adds custom jest matchers from jest-dom
// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MockedProvider } from '@apollo/react-testing';
import { SnackBarProvider } from './snackbar';

const renderApollo = (
  node,
  {
    mocks, addTypename, defaultOptions, cache, resolvers, ...options
  } = {},
) => render(
  <MockedProvider
    mocks={mocks}
    addTypename={addTypename}
    defaultOptions={defaultOptions}
    cache={cache}
    resolvers={resolvers}
  >
    <SnackBarProvider>{node}</SnackBarProvider>
  </MockedProvider>,
  options,
);

// eslint-disable-next-line import/no-extraneous-dependencies
export * from '@testing-library/react';
export { renderApollo as render };
