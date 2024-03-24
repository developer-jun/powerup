'use client';
import React, { useRef } from 'react'
import { CounterProvider } from '@/app/admin/contexts/counterContext'
import Counter from './counter';
import './page.scss';

export const RefFunction = () => {
  const user = {
    first: ''
  }
  const ref = useRef(user);
  const toggle = (e) => {
    e.preventDefault();
    const field = 'first';
    console.log(ref.current[field]);
    ref.current = { first: 'Junifer'};
    setTimeout(() => {
      console.log(ref.current);
      ref.current = { first: 'Hello'};
    }, 5000);
  }

  return (
    <>
      <button onClick={toggle}>Toggle Test</button>
    </>
  )
}
export default function CounterPage() {
  
  return (
    <CounterProvider>
      <Counter>{(num: number) => <>Current Count: {num}</>}</Counter>
      <RefFunction />
    </CounterProvider>
  )
}
