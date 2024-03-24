'use client';

import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";
const initialState = {
  first: '',
  last: '',
  role: ''
}
function getDataStructure<Store>(initialState: Store) {

  return initialState;
}


type MyStorage = typeof initialState;
// export default function createDataContext<Store>(initialState: Store) {
  function useStoreData(){
    
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<MyStorage>) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  export function Provider({ children }: { children: React.ReactNode }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    );
  }

  
  
  /*return {
    Provider,
    useStore,
  };
}*/

export function useStore<SelectorOutput>(
  selector: (store: MyStorage) => SelectorOutput
): [SelectorOutput, (value: Partial<MyStorage>) => void] {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("Store not found");
  }

  const state = useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(initialState),
  );

  return [state, store.set];
}