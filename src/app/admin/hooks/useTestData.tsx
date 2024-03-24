import { useState } from "react";

export default function useTest() {
  const [test, setTest] = useState([]);
  const [error, setError] = useState<Error | null>(null);
  console.log('useTest loaded');

  const fetchTest = async () => {
    try {
      //const response = await fetch('/api/categories');
      //if (!response.ok) throw new Error('Error fetching data');
      setTest([]);
      console.log('done fetching');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch cancelled');
      } else {
        console.error('ERROR FOUND');
        console.error(error);
        setError(error as Error);
      }
    }
  }

  const resetTest = async () => {
    await fetchTest();
  }

  return { myTest: test, resetTest, error };
}