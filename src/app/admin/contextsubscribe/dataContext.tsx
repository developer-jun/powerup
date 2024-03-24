'use client';
import React, { useRef, createContext, useCallback } from "react";
import {Store, DataType} from './dataContextTypes';


/**
 * This is a context that make use of useRef instead of useState to prevent re-render of whole tree.
 * useRef make sense but it also does not re-render parts of the tree or components that needs to re-render and display the changes.
 * Yes we prevented the force re-render property of useState issue but we are also faced with another.
 * So how do we let other component know that the data store has changed?
 * Event listener or Subscription.
 **/

/** 
 * @method Model Store Data - a custom hook
 * get - typical getter, exposes a method access to our store data
 * set - setter, exposes a method to allow others from modifying the data store.
 * subscribe - allows other components outside to subscribe and be notified when a changed happened.
 * 
 * 
 *  - why does this qualify to be a custom hook?
 *  - because it use react's own hooks like useRef and useCallback
 * @returns get, set, subscribe methods
 */
function useStoreData() {
  const dispatch = (state: Store, action: DataType) => {
    console.log('action: ', action);
    switch(action.type) {
      case 'set_first':
        return {
          ...state,
          first: action.payload
        }
      case 'set_last':
        return {
          ...state,
          last: action.payload
        }
      default: 
        return state;
    }

  }
  // This is our DATA STORAGE variable :: STORE ::
  const store = useRef({
    first: "",
    last: "",
  });

  // to let component outside access our STORE
  //const get = useCallback(() => store.current, []);
  const getSnapshot = useCallback(() => store.current, []);

  // a local variable to keep track of our subscribers
  const subscribers = useRef(new Set<() => void>());

  // the component outside uses this to modify our STORE 
  const set = useCallback((action: DataType) => {
    store.current = dispatch(store.current, action); //{ ...store.current, [fieldname]: value};
    subscribers.current.forEach((callback) => callback());
  }, []);


  // keep track of subscribers along with key or selector, which in the case below is the variable callback 
  const subscribe = useCallback((callback: () => void) => {
    console.log('callback:', callback);
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);

  return {
    getSnapshot,
    set,
    subscribe,
  };
}

type UseStoreDataReturnType = ReturnType<typeof useStoreData>;
export const StoreContext = createContext<UseStoreDataReturnType | null>(null);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <StoreContext.Provider value={useStoreData()}> {/* despite we exposing useStoreData method/custom hook to all - we still use another custom hook */}
      {children}
    </StoreContext.Provider>
  );
}
