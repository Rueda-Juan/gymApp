import React from 'react';
import { View, Text } from 'react-native';

const BottomSheet = ({ children }: { children: React.ReactNode }) => (
  <View>
    <Text>BottomSheet</Text>
    {children}
  </View>
);

export default BottomSheet;
