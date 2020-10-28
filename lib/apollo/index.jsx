import { useMemo } from 'react';
import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { persistCache } from 'apollo-cache-persist';
import fetch from 'isomorphic-unfetch';
import { setContext } from '@apollo/client/link/context';
import getConfig from 'next/config';
import { typeDefs, resolvers } from './resolvers';


const { publicRuntimeConfig } = getConfig();

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from reinitializing between page transitions.
let apolloClient = null;

const httpLink = createUploadLink({
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
          list: {
            keyArgs: ['cursor'],
            merge(existing, incoming, { args }) {
              const merged = existing ? existing.slice(0) : [];
              // Insert the incoming elements in the right places, according to args.
              const end = args.cursor.offset + Math.min(args.cursor.first, incoming.length);
              for (let i = args.offset; i < end; i += 1) {
                merged[i] = incoming[i - args.cursor.offset];
              }
              return merged;
            },
            read(existing, { args }) {
              // If we read the field before any data has been written to the
              // cache, this function will return undefined, which correctly
              // indicates that the field is missing.
              const page = existing && existing.slice(
                args.cursor.offset,
                args.cursor.offset + args.cursor.first,
              );
              // If we ask for a page outside the bounds of the existing array,
              // page.length will be 0, and we should return undefined instead of
              // the empty array.
              if (page && page.length > 0) {
                return page;
              }
              return [];
            },
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
    persistCache({
      cache,
      storage: window.localStorage,
    });
  }

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
