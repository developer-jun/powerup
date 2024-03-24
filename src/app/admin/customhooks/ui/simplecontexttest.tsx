import React from 'react'
import {useSimpleContext} from '@/app/admin/contexts/simpleContext';

export default function SimpleContextTest() {
  const {data} = useSimpleContext();
  // setValue('Mr. Context');
  return (
    <div>Simple Context Value: {data}</div>
  )
}
