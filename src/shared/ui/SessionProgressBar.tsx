import React from 'react';
import { View, Text } from 'react-native';

export const SessionProgressBar = ({ progress }: { progress: number }) => (
  <View>
    <Text>Progress: {progress}%</Text>
  </View>
);

export default SessionProgressBar;
