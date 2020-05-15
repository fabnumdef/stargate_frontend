/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
// disable eslint - this imports are good for tests, but not in a test file
import { render } from '@testing-library/react';
// this adds custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

const renderApollo = (
  node,
  router = {},
  {
    mocks, addTypename, defaultOptions, cache, resolvers, ...options
  } = {},
) => {
  // initialise router
  const {
    route = '',
    pathname = '',
    query = {},
    asPath = '',
    push = async () => true,
    replace = async () => true,
    reload = () => null,
    back = () => null,
    prefetch = async () => undefined,
    beforePopState = () => null,
    isFallback = false,
    events = {
      on: () => null,
      off: () => null,
      emit: () => null,
    },
  } = router;
  return {
    ...render(
      <MockedProvider
        mocks={mocks}
        addTypename={addTypename}
        defaultOptions={defaultOptions}
        cache={cache}
        resolvers={resolvers}
      >
        <RouterContext.Provider
          value={{
            route,
            pathname,
            query,
            asPath,
            push,
            replace,
            reload,
            back,
            prefetch,
            beforePopState,
            isFallback,
            events,
          }}
        >
          {node}
        </RouterContext.Provider>
      </MockedProvider>,
    ),
    options,
  };
};

export * from '@testing-library/react';
export { renderApollo as render };
