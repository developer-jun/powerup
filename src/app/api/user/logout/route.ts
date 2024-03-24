import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { userLogin } from '@/lib/user'
//import { setCookie } from '@/utils/cookies';


export async function GET(request: NextRequest) {
    // logged something to the datatabase if needed
    // const user = await userLogin(body.email, body.password);
    console.log("DELETING COOKIES");
    const cookieStore = cookies()
    cookieStore.set('userID', 0, 0);
    cookieStore.set('userName', '', 0);
    cookieStore.set('userType', '', 0);      

    const responseData = {status: 'OK', message: 'User successfully Logout.'}      
  return new Response(JSON.stringify(responseData));
}
