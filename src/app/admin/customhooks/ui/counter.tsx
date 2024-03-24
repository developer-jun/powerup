import React from 'react'
import useCounter from '../../hooks/useCounter';

export default function Counter() {
  const { count, increment, decrement } = useCounter(0);
  return (
    <>
      <div>{count}</div>
      <div><button onClick={e=>increment()}>+</button> : <button onClick={e=>decrement()}>-</button></div>
    </>
  )
}
