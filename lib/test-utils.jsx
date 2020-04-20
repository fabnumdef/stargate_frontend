/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
// disable eslint - this imports are good for tests, but not in a test file
import { render } from '@testing-library/react';
// this adds custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';

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
    {node}
  </MockedProvider>,
  options,
);


export * from '@testing-library/react';
export { renderApollo as render };
