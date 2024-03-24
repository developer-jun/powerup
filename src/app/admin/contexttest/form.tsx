import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../contexts/userContext';
import { useUser } from '../contexts/userContext'
import useDebounce from '@/hooks/useDebounce';

/**
 * A simple form used to modify the context value
 * - Here we have some fun by adding a custom debounce before updating the context which cause the whole DOM tree to re-render on every keystroke.
 * - We made use useRef to handle 
 * @returns 
 */
export default function UserForm() {
  const user = useUser();
  const [temp, setTemp] = useState(user.username);  
  const [formUser, setFormUser] = useState(user.username);  
  //const userRef = useRef();
  let userValue = user.username;
  let counter = 0;
  useEffect(() => { 
    counter++;
    console.log('render count: ', counter);
    if(formUser !== user.username) {
      user.setUser(formUser);
      console.log('updating context');
    }
  }, [formUser]);

  const handleOnChange = (e) => {
    user.setUser(e.target.value);
  }
  const handleRefOnChange = (e) => {    
    console.log('userRef:', e.target.value);
    
    // ALL CUSTOM HOOKS can only be called above the component function, not inside one of it's functions
    // const debouncedValue = useDebounce(e.target.value, 300);

    // console.log('debouncedValue:', debouncedValue);
    const timeoutTracker = setTimeout(() => {
      console.log(temp, '!==', e.target.value, temp !== e.target.value);
      if(temp !== e.target.value) {
        setTemp(e.target.value);
        //user.setUser(e.target.value);
        console.log('temp:', temp);
      }
    }, 500);

    // userValue = e.target.value;
    return () => {
      clearTimeout(timeoutTracker);
    }
  }

  const handleOnChangeLocalState = (e) => {
    const timeoutTracker = setTimeout(() => {
      console.log(formUser, '!==', e.target.value, formUser !== e.target.value);
      if(formUser !== e.target.value) {
        setFormUser(e.target.value);
        console.log('formUser:', formUser);
      }
    }, 500);

    // userValue = e.target.value;
    return () => {
      clearTimeout(timeoutTracker);
    }
  }

  return (
    <div>
      <input type="text" value={user.username} onChange={handleOnChange} />
      <br />
      <input type="text" defaultValue={userValue} onChange={handleRefOnChange} />
      <br />
      <input type="text" defaultValue={user.username} onChange={handleOnChangeLocalState} />
    </div>
  )
}
