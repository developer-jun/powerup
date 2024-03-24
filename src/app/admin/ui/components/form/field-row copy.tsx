import React from 'react'
import useData from '@/app/admin/hooks/useData';

type FieldRowProps = {
  field: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
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
  type: string;
  placeholder: string;
  required: boolean;
}
export function FieldInput({field, placeholder='', required = false, ...props}: FieldInputProps) {
  const [fieldValue, setField] = useData(field, {[field]: ''});

  switch(props.type) {     
    case 'input':
      const [, setSlug] = useData('slug');
      const handleOnChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const inputData = e.target.value;
        setField(inputData);
        if(field === 'name') {
          setSlug(inputData.replace(/\s+/g, '-').toLowerCase());
        }
      }

      return <input
        type="text"
        value={fieldValue} 
        placeholder={placeholder} 
        onChange={handleOnChange} 
        required={required}
        />;
    case 'textarea':
      return <textarea 
        placeholder={placeholder}
        onChange={e=>setField(e.target.value)}
        value={fieldValue} />
    default:
      return <></>;
  }
}