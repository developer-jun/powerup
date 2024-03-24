import { Fields, ValidationRules, ValidationRequiredRule } from "@/types/validation";

export const required = (field: string) => {
  return (field && field.length > 0) ? true : false;
}

export const validEmail = (email: string): boolean => {
  return email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) === null ? false : true;
}

export const validate = (data: any, fields: Fields, rules: ValidationRules): string[] => {
  const results: string[] = [];
  Object.keys(fields).forEach((fieldName) => {
    fields[fieldName].rules.forEach((rule) => { // rules: ['required', 'validEmail'],
      
      const field = data[fieldName];
      const { label } = fields[fieldName];
      const { method, message } = rules[rule];

      if (!method(field)) 
        results.push(`${label} ${message}`);
      
    });
  });

  return results;
}