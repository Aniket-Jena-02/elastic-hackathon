import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value`, updated `delay` ms after the last
 * change. Spec calls for an absolute 250ms debounce on search input.
 */
export default function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}
