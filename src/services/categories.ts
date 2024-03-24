import {JSONData, Category} from "@/types/category";
import { getAPIOptions } from "@/utils/helpers";

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