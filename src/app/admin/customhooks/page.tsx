'use client';
import React, { useRef } from 'react'
import TestForm from './ui/testform';
import Provider from '@/app/admin/contexts/simpleContext';
import useCategories from '../hooks/useCategories';
import Counter from './ui/counter';
import SimpleContextTest from './ui/simplecontexttest';

export default function CustomHookPage() {
  console.log('counter page loaded');  
  //const test = useTest();
  //test.resetTest();
  const data = useCategories();  

  // data.resetCategories();
  return (
    <Provider>
      <div>
        <Counter />
        <div><button onClick={e=>data.resetCategories()}>Refetch Categories</button></div>
        <TestForm />
        <SimpleContextTest />
      </div>
    </Provider>
  )
}
