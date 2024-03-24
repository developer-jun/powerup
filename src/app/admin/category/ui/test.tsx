import React from 'react'
// import useTest from "@/app/admin/hooks/useTestData";
import { useFormInput } from '../../hooks/useFormInput';

export default function Test() {
  const firstName = useFormInput('Jun');
  //const dataObject = useTest();
  console.log('test page loaded');
  //dataObject.resetTest();

  return (
    <div>
      <label>
        First name:
        <input {...firstName} />
      </label>

      <p><b>Good morning, {firstName.value}.</b></p>
    </div>
  )
}
