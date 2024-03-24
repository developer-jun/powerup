import React, { useCallback, useEffect, useRef, useReducer } from 'react'
import { Product } from '@/types/product';
import reducer from '@/app/admin/reducers/customHookReducer';
import {API_HOOK_INIT_STATE, PRODUCT} from '@/app/admin/utils/constants';
import { CustomHookStateType } from '@/types/common';

export default function useProducts(queryString: string = '') {
  const [hookStates, dispatch] = useReducer(reducer<Product[]>, API_HOOK_INIT_STATE as CustomHookStateType<Product[]>);
  const {data, count, useEffectController, loading, message} = hookStates;
  const queryStringRef = useRef(queryString);
  
  const fetchProducts = async (signal: AbortSignal) => {
    let apiUrl = PRODUCT.api_url;
    if(queryStringRef.current) {
      apiUrl = apiUrl.concat('?', queryStringRef.current);
    }
    
    try {
      const response = await fetch(apiUrl, { signal: signal });  
      if (!response.ok) {
        throw new Error('The server seems to be unreachable. A server maintenance is probably in progress. Please try again later.'); // go to catch
      }
  
      const result = await response.json();
      if(result.data) {
        dispatch({ type: 'set_data', payload: result.data });
      }
      if(result.count) {
        dispatch({ type: 'set_count', payload: parseInt(result.count) });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        dispatch({
          type: 'set_message', 
          payload: {
            messageType: 'error', 
            message: error.message
          }
        });
      }
    } finally {
      if (!signal.aborted) {
        dispatch({type: 'set_loading', payload: false});
      }
    }
  }
  useEffect(() => {    
    const abortController = new AbortController();   
    fetchProducts(abortController.signal);
    return () => {
      abortController.abort();
    }
  }, [useEffectController]);

  const refreshProducts = useCallback((qString: string = '') => {
    if(qString) {
      queryStringRef.current = qString;
    }    
    dispatch({type: 'refresh_controller', payload: null});
  }, []);

  return {data, count, loading, message, refreshProducts};
}
