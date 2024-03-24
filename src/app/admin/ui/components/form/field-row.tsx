import React, { useEffect, useState } from 'react'
import { CategoryForm } from "@/types/category"

type FieldRowProps = {
  field: string;
  defaultValue: string | number;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  callback: (field: keyof CategoryForm, value: string) => void;
  addonData: JSX.Element[] | null;
}
export default function FieldRow(props: FieldRowProps) {  
  const { field, label, ..._props } = props;

  return (
    <div className="field-row">
      <label className="label" htmlFor={field}>
        <span className="label-text">{label}</span>
      </label>
      <FieldInput field={field} {..._props} />
    </div>
  )
}

type FieldInputProps = {
  field: string;
  defaultValue: string | number;
  type: string;
  placeholder: string;
  required: boolean;
  callback: (field: keyof CategoryForm, value: string) => void;
  addonData: JSX.Element[] | null;
}
export function FieldInput({field, placeholder='', required = false, ...props}: FieldInputProps) {
  const [fieldValue, setFieldValue] = useState(props.defaultValue);

  useEffect(() => {
    setFieldValue(props.defaultValue);
    console.log(field, ':', props.defaultValue);
  }, [props.defaultValue]);
  
  const handleOnChange = (e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const inputData = e.target.value;
    setFieldValue(inputData);
    props.callback(field as keyof CategoryForm, inputData); // calls parent function and passed the value user entered.
  }

  if(props.defaultValue === undefined) return;
  switch(props.type) {     
    case 'input':
      console.log('input fieldValue: ', fieldValue);
      console.log('field: ', field);
      return <input
        type="text"
        value={fieldValue} 
        placeholder={placeholder} 
        onChange={handleOnChange} 
        required={required}
      />;
    case 'textarea':
      console.log('area fieldValue: ', fieldValue);
      return <textarea 
        placeholder={placeholder}
        onChange={handleOnChange}
        value={fieldValue} 
      />
    case 'select':
      if(fieldValue === undefined)
        setFieldValue(0);
      console.log('sel fieldValue: ', fieldValue);
      return <select value={fieldValue} onChange={handleOnChange}>
        <option value="0">None</option>
        {props.addonData}
      </select>

    default:
      return <></>;
  }
}