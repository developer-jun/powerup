import { JSONData, Category } from "@/types/category";
import { getAPIOptions } from "@/utils/helpers";
import { JSONReturn } from '@/types/common';


export const doUpdateCategory = async (categoryData: Category) => {
  try {
    const response = await fetch('/api/category', getAPIOptions({method: 'POST', data: categoryData}));

    if (response.ok) {
      const data = await response.json();
      return {status: 'OK', message: 'An unexpected SERVER error occurred. Please try again later.'};
    } else {
      throw new Error('Error fetching data');
    }   
  } catch(error) {
    // add a simple logger before returning the error 
    console.error('ERROR FOUND');
    console.error(error);
    return {status: 'NOK', message: "Unable to contact the server, it's either in maintenance mode or having network issues. Please try again later..."};
  } 
}


export const getCategories = async (): Promise<JSONReturn<Category[]>> => {
  try {
    const response = await fetch('/api/categories');
    console.log('server post response');
    console.log(response); 
    if (response.ok) {
      // we already made sure that the response from the server is valid JSONReturn type
      return await response.json() as JSONReturn<Category[]>;
    } else
      throw new Error('Error fetching data');
  } catch(error) {
    // add a simple logger before returning the error 
    console.error('ERROR FOUND');
    console.error(error);
    // we don't want to return an object with error message, the callers expect option data or none at all
    return  {
      status: 'error',
      message: 'API related error encountered, please try again in a few seconds',
      details: String(error),
    };
  } 
}
