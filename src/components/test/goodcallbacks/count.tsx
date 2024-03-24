import React, { memo } from 'react';
interface CountProps {
  text: string,
  count: number
}
function Count({text, count}: CountProps) {
  console.log("Count rendering");
  return (<div>
    {text} is {count}
  </div>);
}
export default memo(Count);