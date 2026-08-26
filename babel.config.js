module.exports = function (api) {
  const isNext = api.caller(
    caller =>
      Boolean(
        caller &&
          (caller.name === 'babel-loader' ||
            caller.name === 'next-babel-turbo' ||
            caller.name === '@next/babel-plugin-document-import' ||
            caller.name === 'next-babel-loader'),
      ),
  );

  if (isNext) {
    return {
      presets: ['next/babel'],
    };
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin',
      [
        './plugins/liquid-glass-resolver',
        {
          // Customize the suffix used for variant files
          // Default: '.liquid' (e.g., component.liquid.tsx)
          suffix: '.liquid',

          // Enable debug logging to see transformation details
          debugLogging: false,

          disabled: process.env.EXPO_PUBLIC_LIQUID_GLASS_ENABLED !== 'true',
        },
      ],
    ],
    env: {
      production: {
        plugins: ['transform-remove-console'],
      },
    },
  };
};
