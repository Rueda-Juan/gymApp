import React from 'react';
import { AppButton } from './AppButton';

/**
 * @deprecated Use AppButton directly from './AppButton'
 */
const PrimaryButton = ({ 
  title, 
  onPress, 
  accessibilityLabel 
}: { 
  title: string; 
  onPress: () => void; 
  accessibilityLabel?: string 
}) => (
  <AppButton
    label={title}
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    appVariant="primary"
  />
);

export default PrimaryButton;
