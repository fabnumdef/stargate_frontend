import React, { useEffect } from 'react';

import { ApolloProvider } from '@apollo/client';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import Head from 'next/head';
import PropTypes from 'prop-types';

import { useApollo } from '../lib/apollo';
import { LoginContextProvider } from '../lib/loginContext';
import { SnackBarProvider } from '../lib/hooks/snackbar';
import theme from '../styles/theme';

/**
 * @component
 * Override comportment of each application's pages
 * @param {AppProps} Components pages components
 * @param {AppProps} pageProps pages props
 */
export default function App({ Component, pageProps }) {
    /** Keep the apollo cache in localStorage to avoid data loss. */
    const apolloClient = useApollo(pageProps);

    useEffect(() => {
        /** Remove the server-side injected CSS. */
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentElement) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    });

    return (
        <ApolloProvider client={apolloClient}>
            <ThemeProvider theme={theme}>
                <SnackBarProvider>
                    <LoginContextProvider>
                        <Head>
                            <title>Stargate</title>
                            <meta
                                name="viewport"
                                content="minimum-scale=1, initial-scale=1, width=device-width"
                            />
                        </Head>
                        <CssBaseline />
                        <Component {...pageProps} />
                    </LoginContextProvider>
                </SnackBarProvider>
            </ThemeProvider>
        </ApolloProvider>
    );
}

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.objectOf(PropTypes.any).isRequired
};
