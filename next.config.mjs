import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    'react-native',
    'react-native-web',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'react-native-screens',
    'react-native-safe-area-context',
    'react-native-worklets',
    'react-native-fast-confetti',
    'react-native-redash',
    '@react-native-seoul/masonry-list',
    '@react-native-masked-view/masked-view',
    '@react-native-menu/menu',
    'react-native-chessboard',
    'react-native-keyboard-controller',
    'react-native-qrcode-skia',
    'react-native-skia-gesture',
    'burnt',
    'zeego',
    'pressto',
    'expo',
    'expo-asset',
    'expo-blur',
    'expo-constants',
    'expo-font',
    'expo-glass-effect',
    'expo-haptics',
    'expo-image',
    'expo-linear-gradient',
    'expo-linking',
    'expo-modules-core',
    'expo-quick-actions',
    'expo-sensors',
    'expo-splash-screen',
    'expo-sqlite',
    'expo-status-bar',
    'expo-system-ui',
    'expo-updates',
    'jotai',
    'color',
    '@expo/vector-icons',
    '@legendapp/list',
    '@react-navigation/native',
    '@react-navigation/bottom-tabs',
    '@react-navigation/drawer',
    '@react-navigation/native-stack',
  ],
  webpack: (config, { isServer, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
      })
    );

    config.resolve.mainFields = ['module', 'browser', 'main'];

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'react-native-nitro-modules': false,
      'react-native-pulsar': fileURLToPath(new URL('./src/stubs/react-native-pulsar-stub.js', import.meta.url)),
      'lottie-react-native': fileURLToPath(new URL('./src/stubs/lottie-react-native-stub.js', import.meta.url)),
      'react-native-gesture-handler$': 'react-native-gesture-handler/lib/module/index.js',
      'react-native-gesture-handler': 'react-native-gesture-handler/lib/module',
      '@expo/ui/swift-ui/modifiers': fileURLToPath(new URL('./src/stubs/expo-ui-stub.js', import.meta.url)),
      '@expo/ui/swift-ui': fileURLToPath(new URL('./src/stubs/expo-ui-stub.js', import.meta.url)),
      '@expo/ui': fileURLToPath(new URL('./src/stubs/expo-ui-stub.js', import.meta.url)),
    };

    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    // Asset loader rule for fonts, images, and binary assets
    config.module.rules.push({
      test: /\.(otf|ttf|woff|woff2|eot|png|jpe?g|gif|svg|webp|astc|mp3|wav|bmp)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]',
      },
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
