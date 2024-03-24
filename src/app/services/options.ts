import { Option, OptionWithItems } from "@/types/option";
import { JSONReturn } from "@/types/common";
import { getAPIOptions } from "@/utils/helpers";

export const getOptions = async (): Promise<JSONReturn<OptionWithItems[]>> => {
  try {
    const response = await fetch('/api/option');
    console.log('server post response');
    console.log(response); 
    if (response.ok) {
      // we already made sure that the response from the server is valid JSONReturn type
      return await response.json() as JSONReturn<OptionWithItems[]>;
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

export const processCreateOption = async (optionData: Option): Promise<JSONReturn<Option>> => {
  try {
    console.log('api call data:', optionData);
    const response = await fetch('/api/option', getAPIOptions({method: 'POST', data: optionData}));
    console.log('server post response');
    console.log(response); 
    if (response.ok) {
      // console.log(await response.json() as JSONReturn<Option>);
      // we already made sure that the response from the server is valid JSONReturn type
      return await response.json() as JSONReturn<Option>;
    } else
      throw new Error('Error fetching data');
  } catch(error) {
    // add a simple logger before returning the error 
    console.error('ERROR FOUND');
    console.error(error);
    return  {
      status: 'error',
      message: 'API related error encountered, please try again in a few seconds',
      details: String(error),
    };
  } 
}