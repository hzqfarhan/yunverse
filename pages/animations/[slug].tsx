import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { View, Text, StyleSheet } from 'react-native';
import { getMetadataForSlug } from '../../src/animations/metadata';
import { ClientDemoWrapper } from '../../src/components/web/ClientDemoWrapper';

export default function AnimationPage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug || typeof slug !== 'string') {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const metadata = getMetadataForSlug(slug);
  const title = metadata?.name ? `${metadata.name} | Demos` : `${slug} | Demos`;

  return (
    <View style={styles.container}>
      <Head>
        <title>{title}</title>
      </Head>

      {/* Floating navigation overlay */}
      <View style={styles.floatingNav}>
        <Link href="/" style={styles.backButton}>
          ← Gallery
        </Link>
        <Text style={styles.demoName}>{metadata?.name || slug}</Text>
      </View>

      {/* Fullscreen Demo Canvas */}
      <ClientDemoWrapper slug={slug} isSimulator={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  floatingNav: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(28, 28, 30, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  backButton: {
    color: '#0A84FF',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'none',
  },
  demoName: {
    color: '#E5E5EA',
    fontSize: 13,
    fontWeight: '500',
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
});
