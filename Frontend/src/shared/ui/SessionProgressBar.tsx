import React from 'react';
import { View, Text } from 'react-native';

const SessionProgressBar = ({ progress }: { progress: number }) => (
  <View>
    <Text>Progress: {progress}%</Text>
  </View>
);

export default SessionProgressBar;
