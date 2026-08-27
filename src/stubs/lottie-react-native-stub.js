import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

export const LottieView = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    play: () => {},
    reset: () => {},
    pause: () => {},
    resume: () => {},
  }));
  return <View {...props} />;
});

LottieView.displayName = 'LottieView';

export default LottieView;
