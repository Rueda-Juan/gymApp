import React from 'react';
import { View, Text } from 'react-native';

export const WorkoutSetRow = ({ setNumber, weight, reps }: { setNumber: number; weight: number; reps: number }) => (
  <View>
    <Text>Set {setNumber}: {weight}kg x {reps}</Text>
  </View>
);

export default WorkoutSetRow;
