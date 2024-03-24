import { NextResponse, NextRequest } from 'next/server'
import { createUser } from '@/lib/user'
import { User } from '@/types/userTypes';


export async function GET(request: NextRequest) {
  console.log('GET function')

}

export async function POST(request: NextRequest) {
  const body = await request.json();
  let responseData;
  console.log(body);
  console.log(body.fullname);
  if(!body.password || !body.cpassword) {
    responseData = { status: 'NOK', message: 'Password is REQUIRED!'};
  } else {
    if(body.password != body.cpassword) {
      responseData = { status: 'NOK', message: 'Did not confirm Password!'};
    }
  }
  //await delay(3000);

  if(!responseData) {
    const userData: User = {
      name: body.fullname,
      email: body.email,
      type: 'ADMIN',
      password: body.password
    }
    const newUser = await createUser(userData);
    if(newUser.error) {
      // there's only a few possible causes of error
      // 1. email being unique, so if email already exists, it will throw an error
      console.log(newUser.error);
      responseData = {status: 'NOK', message: 'User Registration Failed!', errorDetails: newUser.error}
      //if(newUser.error.meta.target === 'User_email_key') {
        // responseData['error'] = "Email address already exists in the database.";
      //  responseData = { ...responseData, error: "Email address already exists in the database."};
      //}
    } else {
      responseData = {status: 'OK', message: 'User successfully Registered.', user: newUser}
    }
    
  }
  
  return new Response(JSON.stringify(responseData));
}




function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}