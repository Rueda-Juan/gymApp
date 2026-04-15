import React from 'react';
import { View, Text } from 'react-native';

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <View>
    <Text>{label}</Text>
    <Text>{value}</Text>
  </View>
);

export default StatCard;
