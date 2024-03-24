"use client";
// import { useEffect, useState } from 'react';
// import { User } from '@/utils/types/userTypes';

const useAuthenticateUser = () => {
  // const [userInfo, setUserInfo] = useState(null);
  const storedUserInfo = localStorage.getItem('userInfo');
  return storedUserInfo? JSON.parse(storedUserInfo):null;
  /*useEffect(() => {
    // Retrieve user information from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (storedUserInfo) {
      // Parse the stored user information as JSON
      const parsedUserInfo = JSON.parse(storedUserInfo);
      
      // Update the state with the retrieved user information
      setUserInfo(parsedUserInfo);
      console.log('parsedUserInfo:',userInfo);
    }
  }, []);

  return userInfo;*/
};

export default useAuthenticateUser;