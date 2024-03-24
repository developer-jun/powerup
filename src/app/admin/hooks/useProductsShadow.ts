import { useRef } from 'react'
import { Product } from '@/types/product';
import { API_HOOK_INIT_STATE } from '@/app/admin/utils/constants';
import { CustomHookStateType } from '@/types/common';

export default function useProductsShadow() {
  // console.count('[hook] useProductsShadow: ');
  const hookStates = useRef(API_HOOK_INIT_STATE as CustomHookStateType<Product[]>);
  //let {data, message} = hookStates.current;
  
  const fetchProducts = async (apiUrl: string, signal: AbortSignal) => {
    console.log('[shadow] fetchProducts function');
    try {
      const response = await fetch(apiUrl, { signal: signal });
  
      if (!response.ok) {
        throw new Error('The server seems to be unreachable. A server maintenance is probably in progress. Please try again later.'); // go to catch
      }  
      const response_data = await response.json();
      hookStates.current.data = null;
      hookStates.current.data = response_data.data; // disregard count for now
      console.log(hookStates.current.data);
      return response_data.data;
    } catch (error) {
      console.log('ERROR FOUND:', error);
      if (error.name !== 'AbortError') {
        hookStates.current.message = { message: error.message, messageType: 'error' } as error.message;
      }
      return null;
    } 
  }
  return {fetchProducts, hookStates};
}
