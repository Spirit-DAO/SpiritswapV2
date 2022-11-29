import { useState } from 'react';

const UseIsLoading = (starting = false) => {
  const [loading, setLoading] = useState(starting);
  const loadingOn = () => setLoading(true);
  const loadingOff = () => setLoading(false);
  return { loadingOn, loadingOff, isLoading: loading };
};

export default UseIsLoading;
