import { ScrollView, YStack, YStackProps, useTheme } from 'tamagui';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps extends YStackProps {
  children: React.ReactNode;
  scroll?: boolean;
}

export function Screen({ children, scroll = true, ...props }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const containerStyle = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  return (
    <YStack flex={1} backgroundColor={theme.background} {...containerStyle} {...props}>
      {scroll ? (
        <ScrollView flex={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </YStack>
  );
}
