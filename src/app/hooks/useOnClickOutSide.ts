import React, { useEffect, useRef } from 'react';

export function useOnClickOutside<T extends HTMLElement>(
  handler: () => void,
): React.RefObject<T> {
  const ref: React.RefObject<T> = useRef(null);

  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);

  return ref;
}
