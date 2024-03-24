"use client"
 
import React, { useReducer} from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ValidationRules, ValidateLoginFields, Fields } from "@/types/validation";
import { required, validEmail, validate } from "@/utils/validations";
import { setLoginField, loginProcessStart, loginAction, 
  loginFailure, loginSuccess } from "@/actions/loginFormActions";

import {initialState, reducer} from "@/reducers/userLoginReducer";
import "./login-form.scss";
import "@/components/layout/form.scss"


const getValidationRules = (): ValidationRules => ({
  required: {
    method: required,
    message: ' is required!',
  },
  validEmail: {
    method: validEmail,
    message: ' is not a valid email!',
  },
});

const getFields = (): Fields => ({
  username: {
    label: 'Username',
    rules: ['required', 'validEmail'],
  },
  password: {
    label: 'Password',
    rules: ['required'],
  },
});

export default function LoginForm() {  
  const [loginState, dispatch] = useReducer(reducer, initialState);
  const { form, user: {email, password} } = loginState; 
  const router = useRouter();    

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {    
    e.preventDefault();
    
    dispatch(loginProcessStart());

    const errors = validate({username: email, password: password}, getFields(), getValidationRules());
    if(errors && errors.length > 0) {  
      dispatch(loginFailure({
        loginAttempts: form.loginAttempts, 
        errors
      }));      
    } else {
      const signInResult = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false 
      });

      if(signInResult && signInResult.error === "CredentialsSignin") {
        dispatch(loginFailure({
          loginAttempts: form.loginAttempts + 1, 
          errors: ['Authentication failed. Please try again!']
        }));   
      } else {
        dispatch(loginSuccess());
        
        router.refresh();
        router.push('/admin');
      }
      
      /*
      const attemptResult = await loginAction(loginState.user);      
      if(attemptResult.STATUS === 'OK') {
        dispatch(loginSuccess());

        router.refresh();
        router.push('/admin');
      } else {
        dispatch(loginFailure({
          loginAttempts: form.loginAttempts + 1, 
          errors: [attemptResult.message]
        }));        
      }
      */
    }
  }

  return (
    <main className="login-form">
      <form className="form login-form" onSubmit={handleFormSubmit}>
        <h2>User Login</h2>
        
        {(form.formMessage && form.formMessage.length) 
          && <ul className="form-error">
            {form.formMessage.map((message:string, index: number) => (
              <li key={index}>{message}</li>
            ))}            
          </ul>
        }

        {form.status === 'PROCESSING' && (
          <div className="snippet" data-title="dot-elastic">
            <div className="stage">
              <div className="dot-elastic"></div>
            </div>
          </div>
        )}
        
        <fieldset className="field-row">
          <label>Email/Username</label>          
          <input type="email" placeholder="email@email.com" defaultValue={email} 
            onChange={e=>dispatch(setLoginField({fieldName: 'email', value: e.target.value}))} />
        </fieldset>
        <fieldset className="field-row">
          <label>Password</label>
          <input type="password" defaultValue={password}  
            onChange={e=>dispatch(setLoginField({fieldName: 'password', value: e.target.value}))}  />
        </fieldset>
        <button type="submit" className="btn" disabled={loginState.form.status === 'PROCESSING'}>Login</button>
      </form>
    </main>
  );
}