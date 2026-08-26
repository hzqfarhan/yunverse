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
    'react-native-pulsar',
    'react-native-redash',
    'pressto',
    'expo',
    'expo-asset',
    'expo-blur',
    'expo-constants',
    'expo-font',
    'expo-haptics',
    'expo-image',
    'expo-linear-gradient',
    'expo-linking',
    'expo-modules-core',
    'expo-sensors',
    'expo-status-bar',
    'expo-system-ui',
    'jotai',
    'color',
    '@expo/vector-icons',
    '@legendapp/list',
    '@react-navigation/native',
    '@react-navigation/bottom-tabs',
    '@react-navigation/drawer',
    '@react-navigation/native-stack',
  ],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'react-native-nitro-modules': false,
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
