"use client"

import React, {useState} from 'react'
import Button from './button';
import Title from './title';
import Count from './count';

export default function BadCallbackDemo() {
  const [age, setAge] = useState(25);
  const [salary, setSalary] = useState(25000)
  const incrementAge = () => {
    setAge(age + 1);
  }
  const incrementSalary = () => {
    setSalary(salary + 1000);
  }

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
 * Why is this practice labeled BAD?
 * - first thing, on small applications, this won't really bug down the server.
 * - the main concerns we have here is that, this component has THREE child components or dependent components.
 * - Those THREE child components could also have children of their own.
 * - Hence, if we change any of the state in this component, the children and the subsequent components will also be forced to render.
 * - Not that it's a bad thing altogether specially if those children are dependent on the states we are updating.
 * - But we know that's not the case, most of those children components are not dependent.
 * - THe BEST practice however, is that, only re-render children components that are dependent to that specific state change.
 * - That's the primary reason why this component is deemed BAD practice.
 **/
