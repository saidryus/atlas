import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay (ms).
 * Returns the debounced value — only updates after the user stops typing.
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
