import {useStore} from "../contexts/createFastContext";
import Display from "./display";
import FormContainer from "./formContainer";

const DisplayContainer = () => {  
  /*const value = 'first';
  const [first] = useStore((store) => store['first']);
  const [last] = useStore((store) => store['last']);*/
 
  return (
    <div className="container">
      <h5>ContentContainer</h5>
      <Display value="first" />
      <Display value="last" />
    </div>
  );
};

export default DisplayContainer;