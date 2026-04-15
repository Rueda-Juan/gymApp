import React from 'react';
import { View, Text } from 'react-native';

const RestChip = ({ seconds }: { seconds: number }) => (
  <View>
    <Text>Rest: {seconds}s</Text>
  </View>
);

export default RestChip;
