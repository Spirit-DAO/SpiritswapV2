import { useEffect, useState } from 'react';

const TWO_MIN_REFRESH_INTERVAL = 1000 * 120;

export const useRefresh = () => {
  const [twoMin, setTwoMin] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      setTwoMin(prev => prev + 1);
    }, TWO_MIN_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { twoMinRefresh: twoMin };
};
