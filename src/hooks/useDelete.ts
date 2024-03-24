import { useState, useEffect } from 'react';
import { MessagePrompt } from '@/types/common';
/**
 * This custom hook is created for this reasons:
 * 1. Usuability
 *    - 
 */
 
type DeleteSingleItemProps = {
  url: string;
  //id: number; // just in case in the future that id is required
}
const emptyPrompt = { messageType: undefined, message: '' };
const useDelete = ()  => {
  const [result, setResult] = useState<MessagePrompt>(emptyPrompt);
  const [loading, setLoading] = useState<boolean | null>(null);  
  
  const execute = async (url: string) => {
    try {
      setLoading(true);
      const result = await fetch(url, { 
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache"
      }).then(response => response.json());
      console.log('ERROR RESULT:', result);
      setResult(result);
    } catch (error: Error) {
      setResult({ messageType: 'error', message: error.message }); // network related error
    } finally {
      setLoading(false);
    }
  };

  const resetStates = () => {
    setResult(emptyPrompt);
    setLoading(null);
  };

  return { result, loading, execute, resetStates };

  /** 
  useEffect(() => {
    fetch(url)
      .then(response => (response.ok) ? setResult(true) : Promise.reject(response))
      .catch(error => setError(error))
      .finally(() => setLoading(false));
    // EXPLAIN: 
    //  - most of our fetch request is usually followed by two consecutive then's, see: useFetch
    //  - the main reason why we removed the second then is to make the code simpler or more concise.
    //  - however, here we only use one, that's because we only need to identify if the response is successful or not.
    //  - if response is successful then we simply set the result to true, while if false we trigger the Promise.reject
    //  - so why use Promise.reject instead of the usual throw response? Because we are using ternary instead of the regular if else.
    //  - apparently how javascript handles asynchronous operation varies on either ternary or regular if else. So it's the only way to do so in ternary mode.
  }, [url]);

  return { result, loading, error };
  */
}

export default useDelete;