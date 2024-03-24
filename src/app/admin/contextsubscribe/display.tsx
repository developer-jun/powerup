import useStore from './useStore';

const Display = ({ value }: { value: "first" | "last" }) => {
  // const [fieldValue] = useStore((store) => store[value]);
  const [fieldValue] = useStore((store) => store[value]);
  return (
    <div className="value">
      {value}: {fieldValue}
    </div>
  );
};

export default Display;