import React from 'react';
import { View, Text } from 'react-native';

const ExerciseMuscleBadge = ({ muscle }: { muscle: string }) => (
  <View>
    <Text>{muscle}</Text>
  </View>
);

export default ExerciseMuscleBadge;
