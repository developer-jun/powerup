import { useState } from 'react';
import {useSimpleContext} from '@/app/admin/contexts/simpleContext';

export function useFormInput(initialValue: string = '') {
  const {setValue} = useSimpleContext();
  const [value, setVal] = useState(initialValue);

  function handleChange(e) {
    setVal(e.target.value);
    setValue(e.target.value)
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
