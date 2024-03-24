"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { useReducer, useRef } from "react"
import { useRouter } from "next/navigation";
import ValidationError from "@/components/validation-error"
import { cookies } from "next/headers"

import {ACTIONS, initialState, reducer} from "@/reducers/userLoginReducer";
import "./login-form.scss";

export default function LoginForm({ userId }) {  
  const [loginState, dispatch] = useReducer(reducer, initialState);
  const emailRef = useRef('');
  const passwordRef = useRef('');

  //const [ APIAction, setAPIAction ] = useState('');
  const { toast } = useToast()  

  if(parseInt(userId)) {
    // const router = 
    useRouter().push('http://localhost:3000/user?userID=', userId);
  }

  // 1. Define your form.
  /*const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })*/
  //const { register, control, handleSubmit, reset, setError, formState: {errors} } = form;
  //console.log('errors:'); 
  //console.log(errors);  rules: /^\s*$/, /\S+/,
  const validate = (fieldName: string, value: string) => {
    const validationRules = [{
      rules: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      field: "email",
      message: "Please enter a valid email address",
    },{
      rules: /\S+/,
      field: "password",
      message: "Password is empty",
    }];

    for (let i = 0; i < validationRules.length; i++) {
      if(validationRules[i].field === fieldName) {
        if (!validationRules[i].rules.test(value))        
          return validationRules[i].message; // validation failed
        return false;
      }
    }
    return false;
  };

  // 2. Define a submit handler.
  async function handleFormSubmit(e) {    
    e.preventDefault();
    const user = {
      email: emailRef.current.value.trim(),
      password: passwordRef.current.value.trim(),
    }

    // one  browser autocomplete doesn't seemed to trigger input's onBlur event for obvious reason.
    dispatch({
      type: ACTIONS.UPDATE_USER_FIELDS, 
      payload: user
    }); 

    console.log("state:", loginState.user);

    // 1. Step 1: need to update the state to update the login attempt.
    // 2. Step 2: update the form action to 'Login Attempt'
    // 3. Step 3: validation
    // We could wait for the validation to finish before updating the form state, that'll save us extra renders.
    const passwordValidation = validate("password", user.password);
    const emailValidation = validate("email", user.email);
    const errors = [];
    
    if(emailValidation)
      errors.push(emailValidation);
    if(passwordValidation)
      errors.push(passwordValidation);

    dispatch({ 
      type: ACTIONS.UPDATE_FORM_FIELDS, 
      payload: { 
        loginAttempts: loginState.form.loginAttempts + 1,
        formAction: 'LOGIN_ATTEMPT',
        formMessage: errors,
        status: 'PROCESSING',
      } 
    });
    
    if(!errors.length) {
      console.log("POSTING TO SERVER")
      try { 
        const options = {
          method: 'POST',
          body: JSON.stringify(user),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      
        // await because we are going to request to the server
        const promise = await fetch('/api/user/login', options);
        // why await still? because just like the above we are also waiting for the server to return and set value to promise object
        const data = await promise.json();
        console.log(data);

        if(data.status === 'OK') {
          // we need to reset the state of the whole app so that the layout will reload and read the cookies to display the appropriate template
          // route.push or redirect will simply go as far as display the page but not the parent layout.tsx file
          window.location.replace('/admin?'+ data.userId);
        } else {
          errors.push(data.message);
          dispatch({ 
            type: ACTIONS.UPDATE_FORM_FIELDS, 
            payload: { 
              formAction: 'LOGIN_ATTEMPT_FAILED',
              formMessage: errors
            }
          });
        }
      } catch(error) {
        errors.push("API ERROR");
        dispatch({ 
          type: ACTIONS.UPDATE_FORM_FIELDS, 
          payload: { 
            formAction: 'LOGIN_ATTEMPT_FAILED',
            formMessage: errors
          }
        });
      }
    }

    dispatch({ 
      type: ACTIONS.UPDATE_FORM_FIELD, 
      fieldName: 'status',
      payload: false
    });
  }
  
  return (
    <main className="login-form">
      <form className="login-form" onSubmit={handleFormSubmit}>
        <h2>User Login</h2>
        
        {loginState.form.formMessage.length ? (
          <ul className="form-error">
            {loginState.form.formMessage.map((message:string) => (
              <li key={message}>{message}</li>
            ))}            
          </ul>
        ):<></>}
        <fieldset className="field-row">
          <label>Email/Username</label>
          <input type="email" placeholder="email@email.com" ref={emailRef} />
        </fieldset>
        <fieldset className="field-row">
          <label>Password</label>
          <input type="password" placeholder="" ref={passwordRef} />
        </fieldset>
        <button type="submit" className="btn" disabled={loginState.form.status === 'PROCESSING'}>Login</button>
      </form>
    </main>
  );
}