'use client';
import React, { useCallback, useReducer } from "react";
import { ContextState, Miscellaneous } from '@/types/common'
import { reducer } from "../reducers/contextStateReducer";
import { OptionAndItems } from "@/types/option";
//import { dataHub } from "../utils/helpers";
// import dataHub from "../hooks/useDataHub";

const dataHub = <T, U>(initialState: ContextState<T, U>) => {
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
  return {
    item,
    items,
    misc,    
    setOption,
    setOptions,
    setMisc
  }
}

interface OptionMiscellaneous extends Miscellaneous {
  refreshOptions: boolean // allow child component to tell parent to requery the options data
}
const optionState: ContextState<OptionAndItems, OptionMiscellaneous> = { 
  item: {} as OptionAndItems,
  items: [] as OptionAndItems[],  
  misc: {
    message: null,
    loading: false,
    refreshOptions: false,
  } as OptionMiscellaneous
}

const OptionContext = React.createContext<{
  item: OptionAndItems;
  items: OptionAndItems[];  
  misc: OptionMiscellaneous;
  setOption: (option: OptionAndItems) => void;
  setOptions: (options: OptionAndItems[]) => void;
  setMisc: (misc: OptionMiscellaneous | Partial<OptionMiscellaneous>) => void;
} | null>(null);

export const Provider = ({children}: {children: React.ReactNode}) => {  
  return (
    <OptionContext.Provider value={dataHub(optionState)}>
      {children}
    </OptionContext.Provider>
  )
}

export default OptionContext;