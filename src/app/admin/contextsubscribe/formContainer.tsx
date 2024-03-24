'use client';
//import TextInput from './textInput';
import useStore from './useStore';

const FormContainer = () => {
  const {dispatch} = useStore();

  return (
    <div className="container">
      <h5>FormContainer</h5>
      First Name: <input defaultValue="" onChange={e=>dispatch({type: 'set_first', payload: e.target.value})} /><br />
      Last Name: <input defaultValue="" onChange={e=>dispatch({type: 'set_last', payload: e.target.value})} /><br />
      {/*<TextInput value="first" />
      <TextInput value="last" />*/}
    </div>
  );
};

export default FormContainer;