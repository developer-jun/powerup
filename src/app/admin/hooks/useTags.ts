'use client';

import { useEffect, useReducer } from 'react'
import { API_HOOK_INIT_STATE } from '../utils/constants';
import { CustomHookStateType, JSONReturn } from '@/types/common';
import reducer from '@/app/admin/reducers/hookReducer';
import { isEmpty } from '@/utils/helpers';
import { Tag } from '@/types/tag';

function modifyInitialState<T>({initialState, componentState}: {initialState: CustomHookStateType<T>, componentState: any}): CustomHookStateType<T> {
  if(componentState && !isEmpty(componentState)) {
    return {
      ...initialState,
      ...componentState
    }
  }
  return initialState;
}

export default function useTags<T>(callerState: CustomHookStateType<T> | Partial<CustomHookStateType<T>> | null) {  
  const [hookStates, dispatch] = useReducer(reducer<T>, { initialState: API_HOOK_INIT_STATE as CustomHookStateType<T>, componentState: callerState}, modifyInitialState<T>);
  const {data, count, useEffectController, loading, message} = hookStates;
  const eventAbortController = new AbortController(); // used for other CRUD operations such as those that are click events

  const fetchTags = async(signal: AbortSignal) => { /**/
    console.log('[useTags] FETCHING');
    try {      
      const response = await fetch('/api/tags', { signal });
      if (!response.ok) {
        throw new Error('The server seems to be unreachable. A server maintenance is probably in progress. Please try again later.'); // go to catch
      }
      const result = await response.json();
      console.log('[response.json]', result);
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
    // used by event driven function to access useTag
    if(useEffectController === -1) {
      return () => {
        eventAbortController.abort();
      }
    }
  }, []);

  useEffect(() => {
    if(useEffectController !== -1) {
      dispatch({type: 'set_loading', payload: true});
      
      const abortController = new AbortController();
      fetchTags(abortController.signal);
      return () => {
        abortController.abort();
      }
      
      
    }    
  }, [useEffectController]);

  const createTag = async (tag: Tag) => {
    try {
      console.log('[createTag] ', tag);
      const response = await fetch('/api/tags', {
        method: 'POST',
        body: JSON.stringify(tag),
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
            message: '['+ tag.name +'] created successfully'
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
  
  const refreshList = () => {
    dispatch({ type: 'refresh_controller', payload: null });
  }

  return {data, count, loading, message, resetMessage, refreshList, createTag, updateOptionItem, deleteOptionItem, useEffectController}
}
