"use client"

import React, { useState, useCallback } from 'react'
import Button from './button';
import Title from './title';
import Count from './count';

export default function GoodCallbackDemo() {
  const [age, setAge] = useState(25);
  const [salary, setSalary] = useState(25000)


  const incrementAge = useCallback(() => {
    setAge(age + 1);
  }, [age]);

  const incrementSalary = useCallback(() => {
    setSalary(salary + 1000);
  }, [salary]);


  

  return (
    <div>      
      <Title/>
      <Count text="age" count={age} />
      <Button handleClick={incrementAge}>Increment my age</Button>
      <Count text="salary" count={salary} />
      <Button handleClick={incrementSalary}>Increment my salary</Button>
    </div>
  )
}

/**
 * Why is this practice labeled GOOD?
 * - Take advantage of useCallback when the caller of a function is in a child component.
 * - That way, the callback function is cached and will always point to that
 **/
