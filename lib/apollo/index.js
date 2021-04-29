import { useMemo } from 'react';
import { ApolloClient } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from '@apollo/client/link/error';
import fetch from 'isomorphic-unfetch';
import merge from 'deepmerge';
import { setContext } from '@apollo/client/link/context';
import getConfig from 'next/config';
import { typeDefs, resolvers } from './resolvers';
import cache from './cache';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from reinitializing between page transitions.
let apolloClient;

const httpLink = createUploadLink({
    uri: typeof window === 'undefined' ? serverRuntimeConfig.API_URL : publicRuntimeConfig.API_URL,
    fetch
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
            credentials: 'same-origin'
        }
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

function createApolloClient() {
    const client = new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: authLink.concat(httpLink, errorLink),
        cache,
        typeDefs,
        resolvers
    });

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

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache);

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data);
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient;

    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export function addApolloState(client, pageProps) {
    const pagePropEdit = { ...pageProps };
    pagePropEdit.props.APOLLO_STATE_PROP_NAME = client.cache.extract();
    return pagePropEdit;
}

export function useApollo(pageProps) {
    const state = pageProps[APOLLO_STATE_PROP_NAME];
    const store = useMemo(() => initializeApollo(state), [state]);
    return store;
}
