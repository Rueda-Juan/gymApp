import React from 'react';
import { View, Text } from 'react-native';

const EmptyState = ({ message }: { message: string }) => (
  <View>
    <Text>{message}</Text>
  </View>
);

export default EmptyState;
