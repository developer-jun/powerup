'use client';

import DisplayContainer from "./displayContainer";
import FormContainer from "./formContainer";

const ContentContainer = () => {
  
  return (
    <div className="container">
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />      
    </div>
  );
};

export default ContentContainer;