/**
 * Used main to retrieved the categories from the server via the fetch method
 * 
 * - One noticeable drawback since we are using useEffect is that, this custom hook is totally dependent to the component
 * - We are after all using the lifecycle of the component, IN SHORT, it's not callable on it's own
 */


import { Category, CategoryHierarchy } from "@/types/category";
import { useCallback, useEffect, useState } from "react";
import { FetchResult, MessagePrompt } from '@/types/common';

const categoryUrl = '/api/categories/'; // won't be affected by any re-render
export default function useCategories(parent: number = 0) {
  const [useEffectController, setUseEffectController] = useState(0); // this control when to trigger the userEffect.
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessagePrompt | null>(null);

  /*const fetchCategories = async (signal: AbortSignal) => {
    try {
      const response = await fetch('/api/categories/'+ parent, { signal });
      if (!response.ok) throw new Error('Error fetching data');
      const data = await response.json();
      setCategories(data);
    } catch (error typeof Error) {
      // disregard operation aborted by the user, he/she since most likely navigated away the component
      if (error.name !== 'AbortError') {
        console.error('ERROR FOUND');
        console.error(error);
        setError(error as Error);
      }
    }
  }*/
  // Why do we need this inside useEffect?
  // - We want this API call to be called after the component mount, and useEffect does that.
  // - But we also only need to call the API once on the whole life cycle of the component or page if possible, adding [] dependency or controlled variable dependency will do the job.
  // - But sometimes, we know we push changes to the database and we need to retrieved those update data, hence we use controlled state variable as the dependency, one modification to the variable and we will be able to call the API once again.
  // - However, on the last item above, we could totally just call fetchCategories direct when we know the category database has changed and will worked just the same. But we'll loose the abort controller to prevent memory leaks when possible. Where it is now is perfect.
  useEffect(() => {
    const abortController = new AbortController();

    fetch(categoryUrl + parent, { signal: abortController.signal })
      .then(response => {
        if (!response.ok) {
          console.log(response);
          throw new Error('The server seems to be unreachable. Please try again later.'); // go to catch      
        }
        return response.json(); // to the next then
      })
      .then(data => {
        console.log('API request result:');
        console.log(data);
        setCategories(data)
      })
      .catch(error => {
        console.log('ERROR FOUND:', error);
        if (error.name !== 'AbortError') // disregard user aborted actions, he/she since most likely navigated away the component
          setMessage({messageType: 'error', message: error.message})
      })
      .finally(() => {
        if (!abortController.signal.aborted) 
          setLoading(false)
      }); //clean up

    return () => {
      abortController.abort(); // user deliberately cancelled the operation
    }
  }, [useEffectController]); // be very mindful of dependencies, make sure you know where they are changed 

  const resetCategories = useCallback(() => {
    setUseEffectController((counter) => counter + 1); // force useEffect to execute again once.
  }, []); // there's a chance that this function is passed to a child component

  return { categories, message, loading, resetCategories };
}