import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { AppRegistry } from 'react-native';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    AppRegistry.registerComponent('Main', () => Main);
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('Main');
    const page = await ctx.renderPage();
    const initialProps = await Document.getInitialProps(ctx);
    const styles = [
      <style
        key="custom-global-style"
        dangerouslySetInnerHTML={{
          __html: `
            html, body, #__next {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: #000000;
              color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              overflow-x: hidden;
            }
            * {
              box-sizing: border-box;
            }
          `,
        }}
      />,
      getStyleElement(),
    ];

    return {
      ...initialProps,
      ...page,
      styles: React.Children.toArray([initialProps.styles, ...styles]),
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
