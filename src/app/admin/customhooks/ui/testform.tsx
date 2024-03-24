import React from 'react'
// import useTest from "@/app/admin/hooks/useTestData";
import { useFormInput } from '../hook/useFormInput';


export default function Testform() {
  const firstName = useFormInput('Jun');
  //const dataObject = useTest();
  console.log('test component loaded');
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
