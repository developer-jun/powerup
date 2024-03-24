import React from 'react'
import { ContextState, Miscellaneous } from '@/types/common'
import { reducer } from "../reducers/contextStateReducer";


const useDataHub = <T, U>(initialState: ContextState<T, U>) => {
  const [{item, items, misc}, dispatch] = React.useReducer(reducer<T, U>, initialState);
  
  const setOption = React.useCallback(
    (option: T) => {
      dispatch({ type: 'SET_ITEM', payload: option });
    }, []);
  const setOptions = React.useCallback(
    (options: T[]) => {
      dispatch({ type: 'SET_ITEMS', payload: options });
    }, []);
  const setMisc = React.useCallback(
    (misc: Partial<U> | U) => {
      console.log('dataHub [setMisc]:', misc); // 
      dispatch({ type: 'SET_MISC', payload: misc });
    }, []);
  const getMisc = React.useCallback(
    (): U => {
      return misc;
    }, []);
  return {
    item,
    items,
    getMisc,
    setOption,
    setOptions,
    setMisc
  }
}

export default useDataHub;
