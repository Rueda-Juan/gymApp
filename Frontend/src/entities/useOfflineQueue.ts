import { useState } from 'react';

export function useOfflineQueue() {
  const [queue, setQueue] = useState([]);
  // Add queue logic as needed
  return { queue, setQueue };
}
