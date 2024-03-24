import { DataContext } from '@/app/admin/contexts/storageContext';
import { DataType } from '@/app/admin/types/data';
import { useContext, useSyncExternalStore } from 'react';

// a field can be a simple primitive type, string number or boolean.
// but it could also be a complex type like object.
// But we would like to discourage that as when it comes to grouped of object, they are not anymore individualized.
// thus, one changes to the object will forced the others to be affected and re-render.
// grouping is only recommended to related data where one is affected by the changes of the other. 
// The only custom hook that has privilege to access DataContext
type DataReturn = 'data' | 'set' | 'both'; // type: DataReturn = 'both',
export default function useData(field: keyof DataType, defaultValue: Partial<DataType> = {}): 
  [DataType[keyof DataType], (value: DataType[keyof DataType]) => void] {    
  const data = useContext(DataContext);
  if (!data) throw new Error("Storage not found");

  const state = useSyncExternalStore(
    data.subscribe,
    () => data.getSnapshot(field),
  ); 
  
  const setField = (value: DataType[keyof DataType]) => {
    data.set({[field]: value} as Partial<DataType>);
  }

  console.log(field,': ', state);
  // console.log(defaultValue);
  // we let the caller provide neccessary object structure with default values since they knows best
  return [state === undefined || state === null ? defaultValue[field] : state, setField];    
}