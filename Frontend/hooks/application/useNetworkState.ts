import { useState } from 'react';

export function useNetworkState() {
  const [isOnline, setIsOnline] = useState(true);
  // Add network detection logic as needed
  return { isOnline, setIsOnline };
}
