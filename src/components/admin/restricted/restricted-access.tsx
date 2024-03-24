"use client";

import React, { useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import "./restricted-access.scss";


function RestrictedAccess() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push('/user/login');
    }, 15000);
  },[]);

  return (
    <div className='restricted-container'>
      <div className='message'>
        Sorry, but this area is restricted.<br /> You will be redirected to the login page in a few seconds.<br /> Or <Link href='/user/login' className='link'>Click Here</Link> to Login
      </div>
    </div>
  )
}

export default RestrictedAccess