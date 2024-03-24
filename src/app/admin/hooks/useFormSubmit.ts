import { useState } from 'react';

export default function useSubmitData() {
  const submitData = async <T>(url: string, data: T): Promise<boolean | string> => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Error submitting data');
      }
      return true;
    } catch (error) {
      return (error as Error).message;
    } 
  };

  return { submitData };
}