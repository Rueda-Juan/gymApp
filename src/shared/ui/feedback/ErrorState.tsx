
import { View, Text, StyleSheet, AccessibilityRole } from 'react-native';

export const ErrorState = ({ message }: { message: string }) => (
  <View
    style={styles.container}
    accessibilityRole={"alert" as AccessibilityRole}
    accessible={true}
    accessibilityLabel={`Error: ${message}`}
  >
    <Text style={styles.text}>Error: {message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 8,
    margin: 8,
  },
  text: {
    color: '#B91C1C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ErrorState;
