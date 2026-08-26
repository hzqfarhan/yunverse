import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { AnimationMetadata } from '../src/animations/registry';
import { ClientDemoWrapper } from '../src/components/web/ClientDemoWrapper';

export default function WebGallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlug, setSelectedSlug] = useState<string>('fluid-slider');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;

  const allDemos = useMemo(() => {
    return Object.entries(AnimationMetadata).map(([slug, meta]) => ({
      slug,
      name: meta.name || slug,
      iconName: meta.iconName,
    }));
  }, []);

  const filteredDemos = useMemo(() => {
    if (!searchQuery.trim()) return allDemos;
    const q = searchQuery.toLowerCase();
    return allDemos.filter(
      d => d.name.toLowerCase().includes(q) || d.slug.toLowerCase().includes(q),
    );
  }, [allDemos, searchQuery]);

  return (
    <View style={styles.container}>
      <Head>
        <title>Demos | Next.js Animation Showcase</title>
        <meta name="description" content="Browse 100+ fluid animations running on React Native and Next.js" />
      </Head>

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerLogo}>✨ Demos Showcase</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{allDemos.length} Animations</Text>
          </View>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search animations..."
          placeholderTextColor="#636366"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Main Body: Split View on Desktop */}
      <View style={[styles.body, isDesktop ? styles.bodyDesktop : styles.bodyMobile]}>
        {/* Sidebar */}
        <View style={[styles.sidebar, isDesktop ? styles.sidebarDesktop : styles.sidebarMobile]}>
          <Text style={styles.sectionHeading}>
            {filteredDemos.length} {filteredDemos.length === 1 ? 'Demo' : 'Demos'} Available
          </Text>
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {filteredDemos.map(item => {
              const isSelected = item.slug === selectedSlug;
              return (
                <TouchableOpacity
                  key={item.slug}
                  onPress={() => setSelectedSlug(item.slug)}
                  style={[styles.listItem, isSelected && styles.listItemActive]}>
                  <View style={styles.itemTextContainer}>
                    <Text style={[styles.itemTitle, isSelected && styles.itemTitleActive]}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemSlug}>{item.slug}</Text>
                  </View>
                  <Link href={`/animations/${item.slug}`} style={styles.fullscreenLink} target="_blank">
                    ↗
                  </Link>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Live Simulator Panel */}
        <View style={styles.previewPanel}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>
              {AnimationMetadata[selectedSlug]?.name || selectedSlug}
            </Text>
            <Link href={`/animations/${selectedSlug}`} style={styles.popoutButton}>
              Open Fullscreen ↗
            </Link>
          </View>
          <View style={styles.canvasContainer}>
            <ClientDemoWrapper slug={selectedSlug} isSimulator={isDesktop} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh' as any,
    backgroundColor: '#0A0A0C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
    backgroundColor: '#111114',
    gap: 16,
    flexWrap: 'wrap',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    fontSize: 14,
    minWidth: 220,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  body: {
    flex: 1,
  },
  bodyDesktop: {
    flexDirection: 'row',
  },
  bodyMobile: {
    flexDirection: 'column',
  },
  sidebar: {
    borderRightWidth: 1,
    borderRightColor: '#1C1C1E',
    backgroundColor: '#0F0F12',
  },
  sidebarDesktop: {
    width: 320,
    height: 'calc(100vh - 65px)' as any,
  },
  sidebarMobile: {
    height: 220,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  sectionHeading: {
    color: '#636366',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    gap: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  listItemActive: {
    backgroundColor: '#242429',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    color: '#D1D1D6',
    fontSize: 14,
    fontWeight: '500',
  },
  itemTitleActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  itemSlug: {
    color: '#636366',
    fontSize: 11,
    marginTop: 2,
  },
  fullscreenLink: {
    color: '#8E8E93',
    fontSize: 14,
    padding: 6,
    textDecorationLine: 'none',
  },
  previewPanel: {
    flex: 1,
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#18181B',
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  popoutButton: {
    color: '#0A84FF',
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'none',
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
