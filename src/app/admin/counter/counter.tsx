'use client';
import { ReactNode, useContext } from 'react'
import { CounterContext, useCounter } from '@/app/admin/contexts/counterContext'
//import { useCounterText } from '@/app/admin/contexts/counterContext'

type ChildrenType = {
    children: (num: number) => ReactNode
}

const Counter = ({ children }: ChildrenType) => {
  // in this example, we call the context direct bypassing the custom hooks
  // note that it's recommended to use the custom hooks that's because we can perform some check to see if the default are nulls
  const { state: { count, text }, increment, decrement, handleTextInput } = useContext(CounterContext)
  
  // here we call our own custom hook  
  //const { count, increment, decrement } = useCounter()
  //const { text, handleTextInput } = useCounterText()

  return (
      <div className='block'>
          <h1>{children(count)}</h1>
          <div>
              <button onClick={increment}>+</button>
              <button onClick={decrement}>-</button>
          </div>
          <input type="text" onChange={handleTextInput} />
          <h2>{text}</h2>
      </div>
  )
}
export default Counter