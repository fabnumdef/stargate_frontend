import React from 'react';

import { ServerStyleSheets } from '@material-ui/core/styles';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Children } from 'react';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="fr">
                <Head>
                    <link
                        rel="preload"
                        as="font"
                        href="/fonts/marianne-bold-webfont.woff"
                        type="font/woff"
                        crossOrigin="true"
                    />
                    <link
                        rel="preload"
                        as="font"
                        href="/fonts/marianne-bold-webfont.woff2"
                        type="font/woff2"
                        crossOrigin="true"
                    />
                    <link
                        rel="preload"
                        as="font"
                        href="/fonts/marianne-regular-webfont.woff"
                        type="font/woff"
                        crossOrigin="true"
                    />
                    <link
                        rel="preload"
                        as="font"
                        href="/fonts/marianne-regular-webfont.woff2"
                        type="font/woff2"
                        crossOrigin="true"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async (ctx) => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />)
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...Children.toArray(initialProps.styles), sheets.getStyleElement()]
    };
};
