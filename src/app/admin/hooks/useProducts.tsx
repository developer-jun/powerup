import { useCallback, useEffect, useRef, useReducer } from 'react'

import { Product } from '@/types/product';
import reducer from '@/app/admin/reducers/customHookReducer';
import {API_HOOK_INIT_STATE, PRODUCT} from '@/app/admin/utils/constants';
import { CustomHookStateType } from '@/types/common';

/**
 * useProducts custom hook
 *  - used to do API call to the server to retrieve Products
 *  - Note that this custom hook will do the retrieval on page load and used querystring sent by the parent component or hook.
 *  - We do have an option to trigger the retrieval of data to the server again by calling the function refreshProducts
 *    - it's still going to use the querystring sent by the parent component
 * @param queryString 
 * @returns 
 */
export default function useProducts(queryString: string = '') {
  const [hookStates, dispatch] = useReducer(reducer<Product[]>, API_HOOK_INIT_STATE as CustomHookStateType<Product[]>);
  const {data, count, useEffectController, loading, message} = hookStates;
  const queryStringRef = useRef('');

  console.count('[useProducts] queryString: '+ queryString);
  
  const fetchProducts = async (signal: AbortSignal) => {
    //console.log('[useP fetchProducts] function');
    let apiUrl = PRODUCT.api_url;
    //if(queryStringRef.current) {
    //  apiUrl = apiUrl.concat('?', queryStringRef.current);
    //} 
    if(queryString) {
      apiUrl = apiUrl.concat('?', queryString);
    }
    
    try {      
      console.log('fetching url: ', apiUrl);
      const response = await fetch(apiUrl, { signal: signal });
  
      if (!response.ok) {
        throw new Error('The server seems to be unreachable. A server maintenance is probably in progress. Please try again later.'); // go to catch
      }
  
      const result = await response.json();
      if(result.data) {
        dispatch({ type: 'set_data', payload: result.data });
      }
      dispatch({ type: 'set_count', payload: parseInt(result.count) });

      queryStringRef.current = queryString; // update querystringRef to the latest querystring
      dispatch({
        type: 'set_message', 
        payload: {
          messageType: 'success', 
          message: 'Successfully fetched products'
        }
      });
      console.log('FETCH results: ', result);
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
    console.log('[useProducts] useEffect: ', queryStringRef.current +'!=='+ queryString);
    // only trigger fetchProducts if previous querystring is not equal to current querystring
    //if(queryStringRef.current !== queryString) {
      const abortController = new AbortController();    
      //apiUrl = PRODUCT.api_url.concat('?', queryStringRef.current);
    
      fetchProducts(abortController.signal);

      return () => {
        abortController.abort(); // if user deliberately cancelled the operation, this will trigger and fetchProducts will also be notified, if there's still pending API request, it will be aborted thus prevent any possible data mismatched.
      }
    //}
  }, [useEffectController]); // we only want to trigger the useEffect when as little as possible

  const insertProduct = (product: Product, limit: number) => {
    
    let productList: Product[] = [];    
    
    if(data?.length) {
      // check if the total number of previous items, if within limit, no need to removed an item but if it's equal to the limit, we need to removed one item to give way to our newest added item.
      let sliceCeil = data?.length;
      if(data?.length === limit) {
        sliceCeil = limit - 1;
      }
      
      productList = [
        ...data?.slice(0, sliceCeil),
      ];  
    }
      
    dispatch({ 
      type: 'set_data', 
      payload: [ 
        product,
        ...productList
      ]
    });
  }

  // we use this function to increment the useEffectController which in term trigger the useEffect
  // this will limit the number of API calls, call the function when sure it's needed to refresh the data
  const refreshProducts = useCallback((qString: string = '') => {
    // if caller sent a querystring, we ought to use ought to use it instead
    if(qString) {
      queryStringRef.current = qString;
    }
    // increment the state variable, this way other states we depends on (useReducer which are batched triggered), would have also been processed and we have the latest values.
    dispatch({type: 'refresh_controller', payload: null});
  }, []);

  return {data, count, loading, message, refreshProducts, insertProduct};
}
