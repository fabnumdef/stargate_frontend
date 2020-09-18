import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import PropTypes from 'prop-types';
import Head from 'next/head';

// Material-UI providers
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { useApollo } from '../lib/apollo';
import { LoginContextProvider } from '../lib/loginContext';
import theme from '../styles/theme';
import { SnackBarProvider } from '../lib/hooks/snackbar';


function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const client = useApollo(pageProps.initialApolloState);

  return (
    <SnackBarProvider>
      <ApolloProvider client={client}>
        <LoginContextProvider client={client}>
          <ThemeProvider theme={theme}>
            <Head>
              <title>Stargate</title>
            </Head>

            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {/* pageProps are never the same,
            and all needed by the component, but well extracted from App props */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </ThemeProvider>
        </LoginContextProvider>
      </ApolloProvider>
    </SnackBarProvider>

  );
}


MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  pageProps: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default MyApp;
