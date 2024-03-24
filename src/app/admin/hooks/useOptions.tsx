'use client';

import { useState, useEffect, useReducer, useMemo, useRef } from 'react'
import { OptionAndItems, OptionItem } from '@/types/option';
import { API_HOOK_INIT_STATE } from '../utils/constants';
import { CustomHookStateType, JSONReturn } from '@/types/common';
import reducer from '@/app/admin/reducers/customHookReducer';
import { isEmpty } from '@/utils/helpers';

function modifyInitialState<T>({initialState, componentState}: {initialState: CustomHookStateType<T>, componentState: any}): CustomHookStateType<T> {
  if(componentState && !isEmpty(componentState)) {
    return {
      ...initialState,
      ...componentState
    }
  }
  return initialState;
}

export default function useOptions<T>(callerState: CustomHookStateType<T> | Partial<CustomHookStateType<T>> | null) {
  //const [options, setOptions] = useState({} as OptionsAndItems);
  const [hookStates, dispatch] = useReducer(reducer<T>, { initialState: API_HOOK_INIT_STATE as CustomHookStateType<T>, componentState: callerState}, modifyInitialState<T>);
  const {data, count, useEffectController, loading, message} = hookStates;
  //const abortController = useMemo(() => new AbortController(), []);
  const eventAbortController = new AbortController();
  const abortFuncs = useRef([]);

  const fetchOptions = async(signal: AbortSignal) => { /**/
    console.log('[useOptions] FETCHING');
    try {      
      const response = await fetch('/api/options', { signal });
      if (!response.ok) {
        throw new Error('The server seems to be unreachable. A server maintenance is probably in progress. Please try again later.'); // go to catch
      }
      const result = await response.json();
      if (result.data) {
        dispatch({ type: 'set_data', payload: result.data });
      }
      dispatch({ type: 'set_count', payload: result.data.length });     
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
    if(useEffectController === -1) {
      return () => {
        eventAbortController.abort();
      }
    }
  }, []);

  useEffect(() => {
    if(useEffectController !== -1) {
      dispatch({type: 'set_loading', payload: true});
      // fetchOptions();
      
      const abortController = new AbortController();
      fetchOptions(abortController.signal);
      return () => {
        abortController.abort();
      }
      
      
    }    
  }, [useEffectController]);

  const createOptionItem = async (newOptionItem: OptionItem) => {
    try {
      console.log('[createOptionItem] ', newOptionItem);
      const response = await fetch('/api/optionItems', {
        method: 'POST',
        body: JSON.stringify(newOptionItem),
        signal: eventAbortController.signal,
      });
      if (!response.ok) {
        throw new Error('The server seems to be unreachable. A server maintenance is probably in progress. Please try again later.'); // go to catch
      }
      const result = await response.json();
      if (result.data) {
        dispatch({ type: 'set_data', payload: result.data });
        dispatch({
          type: 'set_message', 
          payload: {
            messageType: 'success', 
            message: '['+ newOptionItem.item_name +'] created successfully'
          }
        });
      } else {
        dispatch({
          type: 'set_message', 
          payload: {
            messageType: 'error', 
            message: result.message + ' (' + result.details + ')'
          }
        });
      }
      // dispatch({ type: 'set_count', payload: result.data.length });     
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
      if (!eventAbortController.signal.aborted) {
        dispatch({type: 'set_loading', payload: false});
      }
    }
  }

  const updateOptionItem = async (item: OptionItem) => {
    try {
      console.log('[updateOptionItem] ', item);
      const response = await fetch('/api/optionItems/' + item.item_id, {
        method: 'POST',
        body: JSON.stringify(item),
        signal: eventAbortController.signal,
      });
      if (!response.ok) {
        throw new Error('The server seems to be unreachable. A server maintenance is probably in progress. Please try again later.'); // go to catch
      }
      const result = await response.json();
      if (result.data) {
        dispatch({ type: 'set_data', payload: result.data });
        dispatch({
          type: 'set_message', 
          payload: {
            messageType: 'success', 
            message: '['+ item.item_name +'] updated successfully'
          }
        });
      } else {
        dispatch({
          type: 'set_message', 
          payload: {
            messageType: 'error', 
            message: result.message + ' (' + result.details + ')'
          }
        });
      }
      // dispatch({ type: 'set_count', payload: result.data.length });     
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
      if (!eventAbortController.signal.aborted) {
        dispatch({type: 'set_loading', payload: false});
      }
    }
  }

  const deleteOptionItem = async (item: OptionItem) => {
    try {
      console.log('[deleteOptionItem] ', item);
      const response = await fetch('/api/optionItems/' + item.item_id, { 
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache",
        signal: eventAbortController.signal
      });
      if (!response.ok) {
        throw new Error('The server seems to be unreachable. A server maintenance is probably in progress. Please try again later.'); // go to catch
      }
      const result = await response.json();
      if (result.data) {
        dispatch({
          type: 'set_message', 
          payload: {
            messageType: 'success', 
            message: '['+ item.item_name +'] deleted successfully'
          }
        });
      } else {
        dispatch({
          type: 'set_message', 
          payload: {
            messageType: 'error', 
            message: result.message + ' (' + result.details + ')'
          }
        });
      }
      // dispatch({ type: 'set_count', payload: result.data.length });     
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
      if (!eventAbortController.signal.aborted) {
        dispatch({type: 'set_loading', payload: false});
      }
    }
  }  

  const resetMessage = () => {
    dispatch({type: 'set_message', payload: {messageType: undefined, message: ''}});
  }
  
  const refreshOptions = () => {
    dispatch({ type: 'refresh_controller', payload: null });
  }

  return {data, loading, message, resetMessage, refreshOptions, createOptionItem, updateOptionItem, deleteOptionItem}
}
