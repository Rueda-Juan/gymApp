import React from 'react';
import { ScrollView, YStack, YStackProps } from 'tamagui';
import { useSafeAreaInsets, Edge } from 'react-native-safe-area-context';

interface ScreenProps extends YStackProps {
  children: React.ReactNode;
  scroll?: boolean;
  safeAreaEdges?: Edge[];
}

export function Screen({
  children,
  scroll = false,
  safeAreaEdges = ['left', 'right'],
  ...props
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const paddingTop    = safeAreaEdges.includes('top')    ? insets.top    : 0;
  const paddingBottom = safeAreaEdges.includes('bottom') ? insets.bottom : 0;
  const paddingLeft   = safeAreaEdges.includes('left')   ? insets.left   : 0;
  const paddingRight  = safeAreaEdges.includes('right')  ? insets.right  : 0;

  const content = scroll ? (
    <ScrollView
      flex={1}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      {...props}
    >
      {content}
    </YStack>
  );
}