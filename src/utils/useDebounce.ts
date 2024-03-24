import { useState, useEffect } from "react";

export const useDebounce = (data: any, delayTime: number = 200) => {
  const [debouncedData, setDebouncedData] = useState('');

  useEffect(() => {
    const timerObject = setTimeout(() => {
      setDebouncedData(data);
    }, delayTime);

    return () => {
      clearTimeout(timerObject);
    }
  }, [data, delayTime]);

  return debouncedData;
}

// call as: 
// const userSearchInput = useDebounce(textInput, 300); 
// will return the value after 300 milliseconds of pause.
