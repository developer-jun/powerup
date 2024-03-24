import { NextResponse, NextRequest } from 'next/server'
//import { cookies } from 'next/headers'
import { User } from '@/types/userTypes';
import { userLogin } from '@/lib/user'
//import { setCookie } from '@/utils/cookies';
type LoginResponse = {
  status: string, 
  message: string,
  user?: User,
}
export async function POST(request: NextRequest) {
  let responseData: LoginResponse;

  // Step 1: Parsed the user post data
  const { email, password } = await request.json();
  
  // Step 2: Check if we have the user posted data, if not return quickly with an error message
  if(!email || !password) {
    responseData = {
      status: 'NOK', 
      message: 'Unable to parse the provided authentication data. Please try again later.'
    };
    return responseData;
  }

  // Step 3: Calls the login action library which can interact with the database
  const user = await userLogin(email, password); // function will return three like scenario: 1. null - validation failure, 2. error - a database related error has occured, 3. Success - has returned a client data

  // Step 4: Check if Authentication is a success.
  if(user) {
    // Step 4.1: 
    responseData = {status: 'OK', message: 'User successfully Login.', user: user}    
  } else {
    responseData = {status: 'NOK', message: 'Authentication failed. Make sure email and password combination are correct.'}  
    // there's only a few possible causes of error and since this is a Select Query, then it has to be database related, be that connection or server
    console.log(user);
    // responseData = {status: 'NOK', message: 'Database process specific error!', errorDetails: user.error}      
  }    
  
  return new Response(JSON.stringify(responseData));
}
/*
export async function POST(request: NextRequest) {
  const body = await request.json();
  let responseData;
  if(!responseData) {
    const user = await userLogin(body.email, body.password);
    // if prisma authentication failed, the user variable will be null. 
    if(!user) {
      responseData = {status: 'NOK', message: 'Authentication failed. Make sure email and password combination are correct.'}  
      // there's only a few possible causes of error and since this is a Select Query, then it has to be database related, be that connection or server
      console.log(user);
      // responseData = {status: 'NOK', message: 'Database process specific error!', errorDetails: user.error}      
    } else {
        console.log("SETTING COOKIES");
        console.log(user);
        const cookieStore = cookies()
        cookieStore.set('userID', user.id);
        cookieStore.set('userName', user.email);
        cookieStore.set('userType', user.type);      
        //setCookie('userid', user.id)
        //setCookie('username', user.email)
        //setCookie('user_type', user.type)
        responseData = {status: 'OK', message: 'User successfully Login.', userId: user.id}      
    }    
  }  
  return new Response(JSON.stringify(responseData));
}
*/



function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}