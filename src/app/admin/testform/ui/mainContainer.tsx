import React, { useContext } from 'react';
import DisplayContainer from "./displayContainer";
import FormContainer from "./formContainer";
import { useData } from '@/app/admin/contexts/storageContext';


const ContentContainer = () => {
  const [role, setField] = useData('role');

  if(!role) setField('admin');
  // const [firstName, setFirstName] = createWarehouseContext.useData("first");
  return (
    <div className="container">
      <h5>ContentContainer</h5>
      role: {role}
      <FormContainer />
      <DisplayContainer />
    </div>
  );
};

export default ContentContainer;