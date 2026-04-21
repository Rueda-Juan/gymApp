import { useState } from 'react';

export function useRestTimer() {
  const [rest, setRest] = useState(0);
  // Add timer logic as needed
  return { rest, setRest };
}
