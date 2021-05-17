import React, { useEffect, useState } from 'react';
import 'typeface-roboto';

import { ApolloProvider } from '@apollo/client';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import Head from 'next/head';
import NextApp from 'next/app';
import PropTypes from 'prop-types';

import { useApollo } from '../lib/apollo';
import { LoginContextProvider } from '../lib/loginContext';
import { PermissionsContext } from '../lib/permissionsContext';
import { isLoggedInVar, restoreActiveRoleCacheVar, restoreCampusIdVar } from '../lib/apollo/cache';
import { SnackBarProvider } from '../lib/hooks/snackbar';
import theme from '../styles/theme';
import { tokenDuration } from '../utils';
import Layout from '../components/layout';

/**
 * @component
 * Override comportment of each application's pages
 * @param {AppProps} Components pages components
 * @param {AppProps} pageProps pages props
 */
export default function App({ Component, pageProps }) {
    /** Keep the apollo cache in localStorage to avoid data loss. */
    const apolloClient = useApollo(pageProps);

    const [ready, setReady] = useState(false);

    useEffect(() => {
        /** Remove the server-side injected CSS. */
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentElement) {
            jssStyles.parentElement.removeChild(jssStyles);
        }

        /** Restore reactive vars from localStorage */
        const restoreReactiveVars = async () => {
            isLoggedInVar(!tokenDuration().expiredToken);
            await restoreCampusIdVar();
            await restoreActiveRoleCacheVar();
            setReady(true);
        };
        restoreReactiveVars();
    }, []);

    if (!ready) return '';

    return (
        <ApolloProvider client={apolloClient}>
            <Head>
                <title>Stargate</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <SnackBarProvider>
                    <LoginContextProvider>
                        <PermissionsContext>
                            <CssBaseline />
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </PermissionsContext>
                    </LoginContextProvider>
                </SnackBarProvider>
            </ThemeProvider>
        </ApolloProvider>
    );
}

App.getInitialProps = async (ctx) => {
    const appProps = await NextApp.getInitialProps(ctx);
    return { ...appProps };
};

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.objectOf(PropTypes.any).isRequired
};
