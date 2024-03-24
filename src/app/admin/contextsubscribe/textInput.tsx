import useStore from './useStore';

const TextInput = ({ value }: { value: "first" | "last" }) => {
  const {dispatch} = useStore();
  return (
    <div className="field">
      {value}:{" "}
      <input
        value={fieldValue}
        onChange={(e) => dispatch({type: 'set_first', payload: e.target.value})}
      />
    </div>
  );
};

export default TextInput;