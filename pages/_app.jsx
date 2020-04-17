// @flow
import React from 'react';
import App from 'next/app';
import Head from 'next/head';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../styles/theme';
import { SnackBarProvider } from '../lib/snackbar';
import Footer from '../components/styled/footer';

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Stargate</title>
        </Head>
        <ThemeProvider theme={theme}>
          <SnackBarProvider>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {/* pageProps are never the same,
            and all needed by the component, but well extracted from App props */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </SnackBarProvider>
          <Footer />
        </ThemeProvider>
      </>
    );
  }
}

export default MyApp;
