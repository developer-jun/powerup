import React, { useCallback, useEffect, useState } from 'react'

import { Product } from '@/types/product';
import reducer from '@/app/admin/reducers/customHookReducer';
import {API_HOOK_INIT_STATE, PRODUCT} from '@/app/admin/utils/constants';
import { CustomHookStateType } from '@/types/common';

export default function useProducts(url: string = PRODUCT.api_url) {
  const [hookStates, dispatch] = React.useReducer(reducer<Product[]>, API_HOOK_INIT_STATE as CustomHookStateType<Product[]>);
  const {data, useEffectController, loading, message} = hookStates;
  
  const searchProducts = async (signal: AbortSignal) => {
    try {
      const response = await fetch(url, { signal: signal });
  
      if (!response.ok) {
        throw new Error('The server seems to be unreachable. A server maintenance is probably in progress. Please try again later.'); // go to catch
      }
  
      const data = await response.json();
      dispatch({ type: 'set_data', payload: data });
    } catch (error) {
      console.log('ERROR FOUND:', error);
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
    searchProducts(abortController.signal);
    return () => {
      abortController.abort(); // if user deliberately cancelled the operation, this will trigger and fetchProducts will also be notified, if there's still pending API request, it will be aborted thus prevent any possible data mismatched.
    }
  }, [useEffectController]);

  const refreshProducts = useCallback(() => {
    dispatch({type: 'refresh_controller', payload: null});
  }, []);

  return {data, loading, message, refreshProducts};
}
