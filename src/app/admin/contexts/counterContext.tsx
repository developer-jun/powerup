'use client';
import { createContext, useCallback, useContext, useReducer } from "react";

type StateType = {
  count: number;
  text: string;
}
const initState: StateType = { count: 0, text: '' }
const enum REDUCER_ACTION_TYPE {
  INCREMENT,
  DECREMENT,
  NEW_INPUT,
}
type ReducerAction = {
  type: REDUCER_ACTION_TYPE,
  payload?: string,
}

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.INCREMENT:
      return { ...state, count: state.count + 1 }
    case REDUCER_ACTION_TYPE.DECREMENT:
      return { ...state, count: state.count - 1 }
    case REDUCER_ACTION_TYPE.NEW_INPUT:
      return { ...state, text: action.payload ?? '' }
    default:
      throw new Error()
  }
}


// so what's this?
// THIS IS the most important function, since it's here that we defined the interface the other component can use, the state and the methods
// the return area is where we define what other components can access.
// this contents are what we usually defined inside the component which can call the reducer directly.
// in here however, we made it into a custom hook hence the use in the beginning of the name useCounterContext
// so why custom hook? because we need to access react hook useReducer, remember that we can only access them inside a component function or a custom hook.
// const useCounterContext = (initState: StateType) => {
const useCounterContext = (initState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initState)
  
  // useCallback should make sure our reference to these functions remains the same since we are passing them to the provider component.
  const increment = useCallback(() => dispatch({ type: REDUCER_ACTION_TYPE.INCREMENT }), []);
  const decrement = useCallback(() => dispatch({ type: REDUCER_ACTION_TYPE.DECREMENT }), []);
  const handleTextInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
        type: REDUCER_ACTION_TYPE.NEW_INPUT,
        payload: e.target.value
    })
  }, []);

  return {
    state,
    increment,
    decrement,
    handleTextInput
  }
}

/*type UseCounterContextType = ReturnType<typeof useCounterContext>
const initContextState: UseCounterContextType = {
  state: initState,
  increment: () => {},
  decrement: () => {},
  handleTextInput: (e: React.ChangeEvent<HTMLInputElement>) => {}
}*/
// STEP 1: CREATE CONTEXT
// Set an empty object {} as the default as it is required. A null will also work. 
// Note that this is not really the actual default values, they are just last resort hence null is acceptable.
// SO where do we set the actual state variable or a STORE variable?
// That is actually set on the Provider component down below we look for the value={} property of the provider.
// export const CounterContext = createContext<UseCounterContextType | null>(null); // this will also work
// export const CounterContext = createContext<UseCounterContextType | null>(initContextState); // WHY did we not go for this one???
// that's because it's unnecessary, and initContextState declaration looks like our useCounterContext which makes it complicates things.
// initContextState is created for the sake of giving it a default despite not really going to be used unless our provider value={} is empty.
export const CounterContext = createContext({} as ReturnType<typeof useCounterContext>); // initContextState


type ChildrenType = {
  children?: React.ReactElement | React.ReactElement[] | undefined
}

// STEP 2: CREATE A PROVIDER (data provider)
export const CounterProvider = ({
  children
}: ChildrenType): React.ReactElement => {
  // note that we are passing our useCounterContext custom hook directly into the value and giving it a default value.
  // the default value initState is important because it's required, this is after all the structure of our STORE data.
  // ours is defined on the very top of the page, or we can get it from a helper function, so long as we get the exact structure.
  // since we call the custom hook in the value, that translate to value={{state,increment,decrement,handleTextInput}}
  // so any component inside this Provider can directly use any of the state and method above once they call const {state,increment,decrement,handleTextInput} = useContext(CounterContext)
  // but it's a good practice not to directly access our STORE data from directly in the components. 
  // Instead we expose it through additional custom hooks. why custom hooks? because useContext is a react hook.
  // that way we can add additional layer of security if needed.
  return (
    <CounterContext.Provider value={useCounterContext(initState)}>
      {children}
    </CounterContext.Provider>
  );
}



// ACCESSORS HOOKS
type UseCounterHookType = {
  count: number,
  increment: () => void,
  decrement: () => void,
}

export const useCounter = (): UseCounterHookType => {
  const { state: { count }, increment, decrement } = useContext(CounterContext)
  return { count, increment, decrement }
}

type UseCounterTextHookType = {
  text: string,
  handleTextInput: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export const useCounterText = (): UseCounterTextHookType => {
  const { state: { text }, handleTextInput } = useContext(CounterContext)
  return { text, handleTextInput }
}