import type { AppProps } from 'next/app';
import Head from 'next/head';
import { View, StyleSheet } from 'react-native';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Demos | React Native & Web Animations</title>
        <meta name="description" content="High-performance animation collection running on React Native and Next.js" />
      </Head>
      <View style={styles.root}>
        <Component {...pageProps} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#000000',
  },
});
