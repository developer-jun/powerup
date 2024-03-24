import { Option } from "@/types/option";
import { JSONReturn } from "@/types/common";
import { getAPIOptions } from "@/utils/helpers";

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