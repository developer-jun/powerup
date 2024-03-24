import useData from '@/app/admin/hooks/useData';

const TextInput = ({ field }: { field: string }) => {
  const [fieldValue, setField] = useData(field, {[field]: ''});  
  return (
    <div className="input-group">
      <label>{field}:</label> <input value={fieldValue} onChange={e=>setField(e.target.value)} />
    </div>
  );
};

export default TextInput;
