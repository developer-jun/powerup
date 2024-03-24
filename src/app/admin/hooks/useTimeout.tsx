import { useEffect, useRef } from 'react';

// This custom hook is necessary to avoid unnecessary memory leak cause by the usage of setTimeout
// most of the time before the setTimeout finished user must have already navigated somewhere else.
// however tiny memory leak that is, but since it's avoidable, we better do it.
function useTimeout(callback: () => void, delay: number) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout logic.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
}

export default useTimeout;
