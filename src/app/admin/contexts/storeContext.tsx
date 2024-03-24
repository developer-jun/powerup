'use client';

import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";

// generic <DataType>
// this whole file is everything related to the context, wrapped in this 
export default function createStorageContext<DataType>(initState: DataType) {
  
  function useDataWarehouse() {
    // deliberately using useRef to no invoke re-render every time these two objects updates
    // so you might wonder how do we force rerender if want something to display?
    // we are relying on the set method's body below, where 
    const dataObject = useRef(initState);
    const dataOwners = useRef(new Set<() => void>());

    // enclosed in useCallbacks to ensure integrity of the function reference.
    const get = useCallback(() => dataObject.current, []);
    //const set = useCallback((keyPaired: Partial<DataType>) => {
    const set = useCallback((field: string, value: any) => {
      // we are using spread operator to merge the new key paired: {key: value}
      // this way we can just override existing property / variable
      dataObject.current = { ...dataObject.current, ...{[field]: value} };

      // it's here that we loop through the dataOwner's array objects and execute the callback function
      // how we add those callback is through the subscribe function down below
      dataOwners.current.forEach((callback) => callback());
      // as we INVOKES the callback, the consumer of the callback will trigger re-render and that's how we update the value the user sees.
    }, []);
    const subscribe = useCallback((notifier: () => void) => { 
      // so what is this callback function thing parameter?
      // actually, this is managed by useSyncExternalStore function 

      // add is a built-in function of Set which is an added bonus
      // this simply adds the callback to our set
      dataOwners.current.add(notifier);
      
      // then here we return the clean up function, again manage of useSyncExternalStore
      return () => dataOwners.current.delete(notifier);
    }, []);

    // we're exposing three functions for our custom hook to access our core storage object: 
    // set and get - data setter/getter, while the subscribe is used to set subscription to the data.
    // each data set will have an accompanying subscription automatically called.
    return {
      get,
      set,
      subscribe,
    };  
  }

  const StorageContext = createContext<ReturnType<typeof useDataWarehouse> | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    return (
      <StorageContext.Provider value={useDataWarehouse()}>
        {children}
      </StorageContext.Provider>
    );
  }

  function useData<SelectorOutput>(
    selector: (store: DataType) => SelectorOutput
  ) {
    // So why are we sending a function as the argument instead of just values or objects?
    // An example of a real selector function is: (field) => field[value]

    const data = useContext(StorageContext);
    if (!data) {
      throw new Error("StorageContext not found");
    }

    const state = useSyncExternalStore(
      data.subscribe,
      () => selector(data.get()),
      () => selector(initState),
    );

    return [state, data.set];
  }

  return {
    Provider,
    useData,
  };
}
