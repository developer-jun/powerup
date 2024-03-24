import { useState, useEffect } from 'react';
import { FetchResult, MessagePrompt } from '@/types/common';
import { isUrl } from '@/utils/helpers';

const useFetch = <T>(url = ''): FetchResult<T>   => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessagePrompt | null>(null);

  useEffect(() => {
    if (url && isUrl(url)) {
      setLoading(true);
      fetch(url)
        .then(response => {
          if (response.ok)
            return response.json();
          else
            throw response;        
        })
        .then(data => setData(data))
        .catch(error => setMessage({messageType: 'error', message: error.message}))
        .finally(() => setLoading(false));
    } else {
      setMessage({messageType: 'warning', message: 'It appears that the URL is invalid. The system might be under maintenance. If issue persists, please contact the administrator at (admin@web.site).'});
    }
  }, [url]); 

  return { data, loading, message };
}

export default useFetch;