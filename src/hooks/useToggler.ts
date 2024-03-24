import React from 'react'

export default function useToggler(defaultValue: boolean = false, ) {
  const [toggleButton, setToggleButton] = React.useState(defaultValue);
  const [toggleForm, setToggleForm] = React.useState(defaultValue);
  const switchToggle = () => setToggle(!toggle);

  const toggler = {
    // local: toggle,
    set value(val){ setToggle(val) },
    get value(){ return toggle }
  }
  return toggler;
}
