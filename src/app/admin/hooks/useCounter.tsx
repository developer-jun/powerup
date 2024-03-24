import { useState } from "react";


const useCounter = (initValue: number) => {
  console.log('counter hook loaded');
  const [count, setCount] = useState(initValue);

  const increment = () => setCount((counter) => counter + 1);
  const decrement = () => setCount((counter) => counter - 1);

  return { count, increment, decrement };
}

export default useCounter;