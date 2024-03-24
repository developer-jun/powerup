import TextInput from "./textInput";


const FormContainer = () => {
  return (
    <div className="container">
      <h5>FormContainer</h5>
      <TextInput field="first" />
      <TextInput field="last" />
    </div>
  );
};

export default FormContainer;