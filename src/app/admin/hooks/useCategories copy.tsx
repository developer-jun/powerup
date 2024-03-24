import { useEffect, useState } from 'react'
import { Category } from "@/types/category";

export default function useCategories() {
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async (signal: AbortSignal) => {
    try {
      const response = await fetch('/api/categories', { signal });
      if (!response.ok) throw new Error('Error fetching data');
      setCategories(await response.json());
    } catch (apiError) {
      if (apiError?.name === 'AbortError') {
        console.log('Fetch cancelled');
      } else {
        console.error('ERROR FOUND');
        console.error(apiError);
        setError(apiError as Error);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal);

    return () => {
      controller.abort();
    }
  }, [refreshCounter]);

  const resetCategories = () => {
    setRefreshCounter((counter) => counter + 1);
  }

  return { categoryList: categories, resetCategories, error };
}
