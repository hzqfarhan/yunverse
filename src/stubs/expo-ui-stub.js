import { View } from 'react-native';

export const HostComponent = View;
export const withAnimation = Component => Component;
export const useNativeState = initial => [initial, () => {}];

const ExpoUIStub = {
  HostComponent: View,
  withAnimation: Component => Component,
  useNativeState: initial => [initial, () => {}],
};

export default ExpoUIStub;
