import { Product } from '@/types/product'
import React from 'react'

import customHookReducer from '@/app/admin/reducers/customHookReducer';
import {API_HOOK_INIT_STATE, PRODUCT} from '@/app/admin/utils/constants';
import { CustomHookStateType, MessagePrompt } from '@/types/common';

export default function useProductCRUD() {
  const [hookStates, dispatch] = React.useReducer(customHookReducer<Product>, API_HOOK_INIT_STATE as CustomHookStateType<Product>);
  const {loading, message, data} = hookStates;

  const task = async({action, product, categoryId}: {action: string, product: Product, categoryId: number}) => {
    if(action === 'create'){
      create(product, categoryId);
    } else if(action === 'update'){
      update(product, categoryId);
    }
  }

  const deleteProduct = async (productId: number, categoryId: number) => {    
    dispatch({type: 'set_loading', payload: true});
    const postData = {
      product: productId,
      category: categoryId,
      action: 'delete',
    }
    try {
      const response = await fetch(PRODUCT.api_url + '/' + productId + '?category=' + categoryId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        /*body: JSON.stringify(postData)*/
      })
      const {data, message} = await response.json();
      
      dispatch({type: 'set_message', payload: {messageType: 'success', message: 'Product successfully deleted.'}});
    } catch (error) {
      console.error(error)
      dispatch({type: 'set_message', payload: {messageType: 'error', message: error.message}});
    }
    dispatch({type: 'set_loading', payload: false});
  }

  // CRUD
  const create = async (product: Product, categoryId: number) => {
    
    dispatch({type: 'set_loading', payload: true});
    const postData = {
      product: product,
      category: categoryId,
      action: 'create',
    }
    console.log('create function: ',PRODUCT.api_url);
    console.log('postData: ', JSON.stringify(postData));
    try {
      const response = await fetch(PRODUCT.api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })
      const {data, message} = await response.json();
      console.log('json data:')
      console.log(data);
      console.log(data.product);
      //dispatch({type: 'set_data', payload: data.product});
      //dispatch({type: 'set_loading', payload: false});
      //dispatch({type: 'set_message', payload: data.message});
      dispatch({
        type:'set_all', 
        payload: {
          data: data.product, 
          loading: false, 
          message: message
        }
      });
    } catch (error) {
      console.error(error)
      dispatch({type: 'set_message', payload: {messageType: 'error', message: error.message}});
    }
    dispatch({type: 'set_loading', payload: false});
  }

  const update = async (product: Product, categoryId: number) => {
    console.log('[UPDATE]');
    console.log(product);
    console.log(categoryId);
    dispatch({type: 'set_loading', payload: true});
    const postData = {
      product: product,
      category: categoryId,
      action: 'update',
    }
    
    console.log('update function: ',PRODUCT.api_url);
    console.log('postData: ', JSON.stringify(postData));
    try {
      const response = await fetch(PRODUCT.api_url +product.id + '/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })
      const {data, message} = await response.json();
      console.log('json data:')
      console.log(data);
      console.log(data.product);
      //dispatch({type: 'set_data', payload: data.product});
      //dispatch({type: 'set_loading', payload: false});
      //dispatch({type: 'set_message', payload: data.message});
      dispatch({
        type:'set_all', 
        payload: {
          data: data.product, 
          loading: false, 
          message: message
        }
      });
    } catch (error) {
      console.error(error)
      dispatch({type: 'set_message', payload: {messageType: 'error', message: error.message}});
    }
    dispatch({type: 'set_loading', payload: false});
  }

  const setMessage = (_message: MessagePrompt ) => {
    dispatch({type:'set_message', payload: _message});
  }

  return {create, deleteProduct, task, loading, message, data, setMessage};
}
