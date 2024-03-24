import FieldDisplay from "./fieldDisplay";

const DisplayContainer = () => {
  return (
    <div className="container">
      <h5>DisplayContainer</h5>
      <FieldDisplay field="first" />
      <FieldDisplay field="last" />
    </div>
  );
};

export default DisplayContainer;