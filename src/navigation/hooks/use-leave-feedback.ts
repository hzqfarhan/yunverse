import { Alert, Linking } from 'react-native';

import { useCallback } from 'react';

export const useLeaveFeedback = ({ screenName: _screenName }: { screenName: string }) => {
  const leaveFeedback = useCallback(() => {
    Alert.alert('Feedback', 'Thank you for your feedback!');
  }, []);

  return leaveFeedback;
};
