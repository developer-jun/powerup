import { JSONData } from "@/utils/types";
import { UserLogin, User } from "@/types/userTypes";
import { getAPIOptions } from "@/utils/helpers";

export const doLogin = async (formData: UserLogin) => {
  try {
    const response = await fetch('/api/user/login', getAPIOptions({data: formData}));

    if (response.ok) {
      const data = await response.json();
      return {status: 'OK', message: 'Successfully Logged in!', data: data};
    } else {
      throw new Error('Error fetching data');
    }   
  } catch(error) {
    console.error('ERROR FOUND');
    console.error(error);
    return {status: 'NOK', message: "Unable to contact the server, it's either in maintenance mode or having network issues. Please try again later..."};
  } 

  const options = {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    console.log(formData);

    const data = await fetch('', options)
      .then((response) =>response.json())
      .then(jsonData => {
        console.log('jsonData: ', jsonData);
        return jsonData;
      });

      // .then(response => { return response.json();});
    //const jsonData: JSONData = await data.json();
    //console.log('jsonData: ',jsonData);
    return data;
  } catch (err) {
    console.log(err);
    const errorResponse: JSONData = {status: 'NOK', message: 'An unexpected SERVER error occurred. Please try again later.'};
    return errorResponse;
  }
}



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