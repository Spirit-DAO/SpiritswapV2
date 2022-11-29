import { useEffect, useRef, useState } from 'react';

export function useDebouncedValue(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => clearTimeout(handler);
    }
    isMounted.current = true;
    return undefined;
  }, [delay, value]);
  return debouncedValue;
}
