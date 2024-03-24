import React, { useEffect, useState } from 'react'

/**
 * We use this hook to control the showing and hiding of the alert dialog.
 * - It's just a perfect scenario where custom hook makes a lot of sense
 * - That's because if this is placed within the component, 
 * - we would still need to use the same useEffect as it is now, one dependency only to avoid mixed.
 * - if not, then we would need to keep track of the previous value of the dependency and compare it with the current value.
 * 
 * @param dependency - it's type doesn't matter since we only care when it changes or not
 * @returns {alertOpen, setAlertOpen} - which is our state object
 */
export default function usePromptToggle(dependency: any) {
  const [ toggle, setToggle ] = useState<boolean>(true);
  
  useEffect(() => {    
    setToggle(true);
  }, [dependency]);

  return {toggle, setToggle};
}
