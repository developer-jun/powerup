export type ValidationRequiredRule = {
  method: (value: string) => boolean;
  message: string;
};

type ValidationValidEmailRule = ValidationRequiredRule & {  
  method: (value: string) => boolean;
};

export type ValidationRules = {
  required: ValidationRequiredRule;
  validEmail: ValidationRequiredRule; //ValidationValidEmailRule;
};

type InputFieldRules = {
  fieldname: string;
  rules: Array<string>,
}

export type ValidateLoginFields = {
  username: InputFieldRules;
  password: InputFieldRules;
}

type Rules = 'required' | 'validEmail'; // add more when needed

export type Fields = {
  [key: string]: {
    label: string;
    rules: Rules[];
  };
};