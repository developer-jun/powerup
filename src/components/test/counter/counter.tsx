"use client"
import { useReducer } from 'react'
import { countReducer, ACTIONS, COUNT_INITIAL_STATE } from '@/reducers/counterReducer'

import "./counter.scss"

export default function Counter() {
  const [counterState, dispatch] = useReducer(countReducer, COUNT_INITIAL_STATE);

  return (
    <div className='counter'>
      <div className="flex w-full justify-center">
        <div className="w-full text-center">
          <span className="badge">{counterState.count}</span>
        </div>
      </div>
      <div className="counter-buttons">            
        <div className="flex-none w-32">
          <button className='btn' onClick={()=>{dispatch({type: 'reset'})}}>RESET</button>
        </div>
        <div className="flex-initial w-64">
          <button className='btn'onClick={()=>{dispatch({type: 'increment'})}}>+</button>
        </div>
        <div className="flex-initial w-32">
          <button className='btn'onClick={()=>{dispatch({type: 'decrement'})}}>-</button>
        </div>
        <div className="flex-initial w-32">
          <button className='btn'onClick={()=>{dispatch({type: 'add', payload: 100})}}>+100</button>
        </div>            
      </div>

    </div>
  )
}
