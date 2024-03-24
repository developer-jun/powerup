import React, { ReactNode, useState, createContext, useContext } from "react";

/** ANATOMY of a CONTEXT */

// TYPE is very much required in typescript hence this is important,
// but still optional if we really want to. But use Type to make your data more safer
// your context will look like this without type: createContext(null);
// 0. Create our STORE type and Store default structure (OPTIONAL)
type UserInfo = {
  username: string, 
  setUser: React.Dispatch<React.SetStateAction<string>>, 
}
// 1. Create a context (REQUIRED)
export const UserContext = createContext<UserInfo | null>(null);
// 2. Create a Provider component function (REQUIRED)
export default function UserContextProvider({children,}: {children: ReactNode}){
  // 2.1 Required, declare our state or STORE object (REQUIRED). Use custom hook to define a more complex STORE structure
  const [username, setUser] = useState('');
  // 2.2 Exposed our state or STORE variable to other components via value={{username, setUser}} (REQUIRED)
  return (
    <UserContext.Provider 
      value={{username, setUser}}
    >
      {children}
    </UserContext.Provider>
  );
};
// 3. Accessor custom hooks (OPTIONAL). Created and recommended only because of the if(user === null) part. Other than that unnecessary.
export const useUser = () => {
  const user = useContext(UserContext);
  //const dispatch = (type, payload) => {
  //  setUser({...userData,[type]: payload})
  //}
  if(user === null) 
    throw new Error('User context is null');

  return user;  
}

// THAT'S ALL THERES TO IT TO THE CONTEXT definition
// in the component, we consume context const {username, setUser} = useContext(UserContext);