import React, { Component, ReactNode, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { getMetadataForSlug } from '../../animations/metadata';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackSlug: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class DemoErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn(`Error rendering animation "${this.props.fallbackSlug}":`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Native-Specific Demo</Text>
          <Text style={styles.errorMessage}>
            "{this.props.fallbackSlug}" utilizes native C++/Metal/Vulkan graphics or sensors that require a native iOS/Android device.
          </Text>
          <Text style={styles.errorSub}>Run with `bun ios` or `bun android` to view this demo with full native acceleration.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

interface ClientDemoWrapperProps {
  slug: string;
  isSimulator?: boolean;
}

export const ClientDemoWrapper: React.FC<ClientDemoWrapperProps> = ({ slug, isSimulator }) => {
  const [mounted, setMounted] = useState(false);
  const [registryModule, setRegistryModule] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 });

  useEffect(() => {
    setMounted(true);
    import('../../animations/registry')
      .then(mod => {
        setRegistryModule(mod);
      })
      .catch(err => {
        console.warn('Failed to load animations registry:', err);
      });

    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setDimensions({
        width: isSimulator ? Math.min(width, 390) : width,
        height: isSimulator ? Math.min(height, 844) : height,
      });
    };
    updateDimensions();
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove?.();
  }, [isSimulator]);

  if (!mounted || !registryModule) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading animation...</Text>
      </View>
    );
  }

  const AnimationComponent = registryModule.getAnimationComponent(slug);
  const metadata = getMetadataForSlug(slug);

  if (!AnimationComponent) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorTitle}>Demo not found</Text>
        <Text style={styles.errorMessage}>No animation matching "{slug}" was found in the registry.</Text>
      </View>
    );
  }

  return (
    <DemoErrorBoundary fallbackSlug={slug}>
      <View style={[styles.container, isSimulator && styles.simulatorContainer]}>
        <AnimationComponent width={dimensions.width} height={dimensions.height} />
      </View>
    </DemoErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  simulatorContainer: {
    width: '100%',
    height: '100%',
    maxHeight: 844,
    maxWidth: 390,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#000000',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 12,
  },
  errorCard: {
    padding: 24,
    maxWidth: 340,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    alignItems: 'center',
    textAlign: 'center',
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    color: '#AEAEB2',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorSub: {
    color: '#636366',
    fontSize: 12,
    textAlign: 'center',
  },
});
