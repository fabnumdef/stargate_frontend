import { useMemo } from 'react';
import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { setContext } from 'apollo-link-context';
import getConfig from 'next/config';
import { typeDefs, resolvers } from './resolvers';

const { publicRuntimeConfig } = getConfig();

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from reinitializing between page transitions.
let apolloClient = null;

const httpLink = createHttpLink({
  uri: publicRuntimeConfig.API_URL,
  fetch,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      credentials: 'same-origin',
    },
  };
});


function createApolloClient() {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Reusable helper function to generate a field
          // policy for the Query.search field, keyed by
          // search query:
          getCampus: {
            keyFields: ['listRequestByVisitorStatus', 'listMyRequests'],
          },
        },
      },
    },
  });

  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache,
    typeDefs,
    resolvers,
  });

  if (typeof window !== 'undefined') {
    client.writeQuery(
      {
        query: gql`
      query initCache {
        initializedCache
      }
      `,
        data: {
          initializedCache: false,
        },
      },
    );
  }
  return client;
}

export function initializeApollo(initialState = null) {
  // eslint-disable-next-line no-underscore-dangle
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
