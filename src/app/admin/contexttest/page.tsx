'use client';

import React, { useContext } from 'react'
import { useUser, UserContext } from '../contexts/userContext'
import UserForm from './form';

export default function page() {
  const {username} = useContext(UserContext);
  const user = useUser(); // calls the hooks which simple abstract the UserContext object
  console.log(user);
  return (
    <div>
      username 1: {username}<br />
      username: {user?.username}
      <UserForm />
    </div>
  )
}
