'use client';

import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, useSyncExternalStore } from 'react';
import { Task, Tasks } from '../types/task';
import { tasksReducer, initialTasks } from '../reducers/tasksReducer';

export type Store = { 
  tasks: Task[];
  first: string; 
  last: string
};
type UseStoreDataReturnType = ReturnType<typeof useStoreData>;
// 1. context
const TasksContext = createContext<UseStoreDataReturnType | null>(null);
// 2. provider
export function TasksProvider({ children }: {children: React.ReactNode}) {
 
  return (
    <TasksContext.Provider value={useStoreData()}>
      {children}
    </TasksContext.Provider>
  );
}

export const storeReducer = (state: Store, action: any) => {
  switch (action.type) {
    case 'added': {
      return [...state, {
        id: action.id,
        text: action.text,
        done: false
      } as Task];
    }
    case 'changed': {
      return state.map(_task => {
        if (_task.id === action.task.id) {
          return action.task;
        } else {
          return _task;
        }
      });
    }
    case 'deleted': {
      return state.filter(_task => _task.id !== action.id);
    }
    default: {
      // throw Error('Unknown action: ' + action.type);
      return state;
    }
  }
}

export function useStoreData(): {
  get: () => Store;
  //set: (value: Partial<Store>) => void;
  set: (type: string, payload: any) => void;
  subscribe: (callback: () => void) => () => void
} {

  // This is our DATA STORAGE variable :: STORE ::
  const store = useRef({
    tasks: initialTasks,
    first: '',
    last: '',
  });

  // to let component outside access our STORE
  const get = useCallback(() => store.current, []);

  // a local variable to keep track of our subscribers
  const subscribers = useRef(new Set<() => void>()); // set will not allow duplicates, thus overwriting existing for us automatically, no need to delete manually.

  // the component outside uses this to modify our STORE 
  //const set = useCallback((value: Partial<Store>) => {
  const set = useCallback((type, payload) => {


    // need to expand this because { ...store.current, ...value } will only work for simple value such as first and last
    // for array, if we want to update an item in here we will have to loop, look for the item then update
    // the value would be like: {first: 'jun'}
    store.current = storeReducer(store.current, {type: type, payload: payload}) //{ ...store.current, ...value }; // value is {first: 'new first name'}
    subscribers.current.forEach((callback) => callback()); // this where callbacks are being called, thus re-rendering parts of the APP tree
  }, []);

  // keep track of subscribers along with key or selector, which in the case below is the variable callback 
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

/*
// 3. custom hook
export function useTasks() {
  const taskContext = useContext(TasksContext)

  if(taskContext === null)
    throw new Error('TASK CONTEXT IS NULL. Did your forgot to give it a value?');

  const {tasks, dispatch} = taskContext;

  return {tasks, dispatch};
}

*/

// This is one another custom hook that have the sole access to our STORE defined at dataContext 
// this is what other components call.
// const [fieldValue, setStore] = useStore((store) => store[value]);
// such a very unique way we call a function. INSTEAD of a direct value like useStore(value), we give it a statement '(store) => store[value]'
export function useStore<SelectorOutput>(
  selector: (store: Store) => SelectorOutput // specifically created to narrow down what the caller wants. If a textbox use this, it would only be interested in one field only not the whole array of objects
): [SelectorOutput, (value: Partial<Store>) => void] {
  
  // this is the STORE exposed methods
  const context = useContext(TasksContext);

  if (!context) 
    throw new Error("Store not found");
  
  // useSyncExternalStore is a React Hook that lets you subscribe to an external store
  // subscribe is one of the exposed method by the context with with get and set
  // this let's us subscribe to object store which is in our context exposed via useContext
  // remember in our example above, we pass (store) => store[value], when that execute, for text input 'first' it will be like:
  // on the argument () => selector(store.get()) is where we place our statement () => selector((store) => store[value]) 
  // thus the store.get() return value will now be in the local variable store variable
  // then store[value] is equivalent to store['first'] or store.first 
  // it's current value which is empty at first run.
  // store
  const state = useSyncExternalStore(
    context.subscribe, 
    () => selector(context.get()) 
  );

  // state is the result of store[value] which be default is empty
  // store.set is the context set exposed method to modify store.
  return [state, context.set];
}

export function useStore2(): [Store, (value: Partial<Store>) => void] {
  const context = useContext(TasksContext);
  if (!context) 
    throw new Error("Store not found");

  const [state, setState] = useState(context.get())
  useEffect(() => {
    return context.subscribe(() => setState(context.get()));
  }, []);


  /*const state = useSyncExternalStore(
    context.subscribe, 
    () => selector(context.get()) 
  );*/

  return [state, context.set];
}