import React from 'react';
import { View, Text } from 'react-native';

const ExerciseCard = ({ name }: { name: string }) => (
  <View>
    <Text>{name}</Text>
  </View>
);

export default ExerciseCard;
