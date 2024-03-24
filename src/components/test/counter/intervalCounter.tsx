"use client";

import React, { useState, useEffect } from 'react'

export default function IntervalCounter() {
  const [counter, setCounter] = useState(0);

  let intervalCounter = 0;
  useEffect(() => {
    intervalCounter++;
    const intervalObj = setInterval(() => {
      console.log('[',intervalCounter,'] interval counter: ', counter);
      setCounter((counter) => counter + 1);
    }, 1000);
    
    return () => {
      clearInterval(intervalObj);
    };
  }, counter);


  return (
    <div>intervalCounter: {counter}</div>
  )
}