import DisplayContainer from "./displayContainer";
import FormContainer from "./formContainer";
import {useStore} from "../contexts/createFastContext";

const ContentContainer = () => {
  const [role, setStore] = useStore((store) => store['role']);

  if(role === '') setStore({ role: 'admin' });
  return (
    <div className="container">
      <h5>ContentContainer role: {role}</h5>

      <FormContainer />
      <DisplayContainer />
    </div>
  );
};

export default ContentContainer;