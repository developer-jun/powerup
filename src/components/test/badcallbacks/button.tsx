import React from 'react';

interface ButtonProps{
  handleClick: () => void;
  children: React.ReactNode;
}

function Button({children, handleClick}: ButtonProps) {
  console.log(`Button clicked ${children}`);
  return (
    <div>
      <button className='btn' onClick = {handleClick}> {children} </button>
    </div>
  );
}
export default Button;