import { useData } from '@/app/admin/contexts/storageContext';

const dataStructure = {
  first: '',
  last: '',
}
const TextInput = ({ field }: { field: "first" | "last" }) => {
  // const [fieldValue, setField] = useData(field);
  // const [fieldValue, setField] = createWarehouseContext(dataStructure).useData(field);
  const [fieldValue, setField] = useData(field);

  const handleOnChange = (e) => {
    console.log(e.target.value);
    console.log('Calling setField');
    setField(e.target.value);
  }
  console.log()
  return (
    <div className="field">
      {field}:{" "}
      <input
        value={fieldValue}
        onChange={handleOnChange} />
    </div>
  );
};

export default TextInput;
