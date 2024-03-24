import { signIn } from "next-auth/react"
import { UserLogin } from "@/types/userTypes";
import * as ACTIONS from '@/constants/userLogin';

export const setLoginField = ({fieldName, value}: {fieldName: string, value: string}) => ({
  type: ACTIONS.UPDATE_USER_FIELD, 
  fieldName: fieldName,
  payload: value
})

export const loginProcessStart = () => ({ 
  type: ACTIONS.LOGIN_PROCESS_START, 
  payload: {
    formAction: 'LOGIN_ATTEMPT',
    status: 'PROCESSING'
  }
});

export const loginAction = async (userData: UserLogin) => {
     
  const signInResult = await signIn('credentials', {
    email: userData.email,
    password: userData.password,
    redirect: false 
  });

  return (signInResult && signInResult.error === "CredentialsSignin") 
    ? { STATUS: 'NOK', message: 'Authentication failed. Please try again!'}    
    : { STATUS: 'OK', message: 'Successfully verified!'}    
}

export const loginFailure = ({loginAttempts, errors} 
  : {loginAttempts: number, errors: string[] | null}) => ({ 
  type: ACTIONS.LOGIN_FAILURE, 
  payload: { 
    formAction: 'LOGIN_ATTEMPT',
    loginAttempts: loginAttempts,
    formMessage: errors,
    status: '',
  } 
});

export const loginSuccess = () => ({ 
  type: ACTIONS.LOGIN_SUCCESS, 
  payload: {
    status: 'PROCESSING'
  }
});