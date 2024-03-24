import {
  useContext,
  useSyncExternalStore,
} from "react";
import { StoreContext } from './dataContext';
import { DataType, Store } from './dataContextTypes';

// This is one another custom hook that have the sole access to our STORE defined at dataContext 
// this is what other components call.
// const [fieldValue, setStore] = useStore((store) => store[value]);
// such a very unique way we call a function. INSTEAD of a direct value like useStore(value), we give it a statement '(store) => store[value]'
function useStore() {
  
  // this is the STORE exposed methods
  const store = useContext(StoreContext);
  if (!store) 
    throw new Error("Store not found");
  
  // useSyncExternalStore is a React Hook that lets you subscribe to an external data source
  // in our case it will be the variable inside StoreContext
  // store.subscribe - register a callback that is called when the store changes
  // store.getSnapshot - current value of the store
  // subscribe is one of the exposed method by the context with with get and set
  // this let's us subscribe to object store which is in our context exposed via useContext
  // remember in our example above, we pass (store) => store[value], when that execute, for text input 'first' it will be like:
  // on the argument () => selector(store.get()) is where we place our statement () => selector((store) => store[value]) 
  // thus the store.get() return value will now be in the local variable store variable
  // then store[value] is equivalent to store['first'] or store.first 
  // it's current value which is empty at first run.
  // store
  const state = useSyncExternalStore(
    store.subscribe, 
    store.getSnapshot 
  );

  const dispatch = (action: DataType) => { //{fieldname, value}: {fieldname: string, value: string}
    store.set(action);
  }

  const getData = (field: string = ''): Store | Partial<Store> => {
    if(field !== '' && state.hasOwnProperty(field)) {
      return state[field];
    } else {
      return state;
    }
  }

  // state is the result of store[value] which be default is empty
  // store.set is the context set exposed method to modify store.
  return {getData, dispatch};
}

export default useStore;