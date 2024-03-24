import { UserLogin } from "@/types/userTypes";

const getValidationRules = () => {
  return [{
    rules: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    field: "email",
    message: "Please enter a valid email address",
  },{
    rules: /\S+/,
    field: "password",
    message: "Password is empty",
  }]
}

const validateField = (fieldName: string, value: string) => {
  const validationRules = getValidationRules();

  for (let i = 0; i < validationRules.length; i++) {
    if(validationRules[i].field === fieldName) {
      if (!validationRules[i].rules.test(value))        
        return validationRules[i].message; // validation failed
      return false;
    }
  }
  return false;
};

export const formValidation = (user: UserLogin) => {
  const errors = [];
  for (const userAttr in user) {
    let validateResult = validateField(userAttr, user[userAttr]);
    if(validateResult) 
      errors.push(validateResult);    
  }

  return errors;

  /*
  const passwordValidation = validateField("password", user.password);
  const emailValidation = validateField("email", user.email);
  
  
  if(emailValidation)
    errors.push(emailValidation);
  if(passwordValidation)
    errors.push(passwordValidation);

  return errors;
  */
};