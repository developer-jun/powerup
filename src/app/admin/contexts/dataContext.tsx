'use client';
import React, { useRef, createContext, useContext, useCallback, useSyncExternalStore } from "react";

export default function dataContext() {
  type DataType = {
    first: string;
    //last: string;
  }
  const dataStore: DataType = {
    first: "",
    //last: "",
  }

  function dispatch(state: DataType, action: any) {

    switch(action.type) {
      case 'set_field':
        console.log('setting field: ', action);
        return {
          ...state,
          [action.field]: action.payload
        }
      default: 
        return state;
    }

  }
  let user = '';
  function useStoreData(): {
    get: () => DataType;
    getSnapshot: (field: string) => string;
    //set: ({field, payload}:{field: string, payload: string}) => void;
    set: (value: string) => void;
    subscribe: (callback: () => void) => () => void;
  } {
    //const store = useRef(initialState);
    const store = useRef(dataStore);
    const get = useCallback(() => store.current, []);
    // const getSnapshot = useCallback((field: string) => store.current[field], [field]);
    const getSnapshot = useCallback((field: string) => store.current['first'], []);
    const subscribers = useRef(new Set<() => void>());
    
    //const set = useCallback((action: Partial<Store>) => {
    //const set = useCallback((action: {field: string, payload: string}) => {
    const set = useCallback((value: string) => {
      store.current = {...store.current, first: value};
      // store.current = dispatch(store.current, {type: 'set_field', payload: action}); //{ ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());

      console.log('store.current: ',store.current);
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      getSnapshot,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    );
  }

  /*function useStore<SelectorOutput>(
    selector: (store: DataType) => SelectorOutput
  ): [SelectorOutput, ({field, payload}:{field: string, payload: string}) => void] {*/
  function useStore(field: string) {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("Store not found");
    }
    console.log('use store called');
    const state = useSyncExternalStore(
      store.subscribe,
      () => store.getSnapshot(field),
      //() => selector(dataStore),
    );

    return [state, store.set];
  }

  return {
    Provider,
    useStore,
  };
}