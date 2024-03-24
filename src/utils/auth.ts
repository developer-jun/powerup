import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from '@/types/userTypes';
import { userLogin } from '@/lib/user'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/user/login',
  },
  debug: true,
  providers: [

    CredentialsProvider({      
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@mail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) { // credentials, req       
        
        console.log('AUTHORIZATION');
        if(!credentials?.email || !credentials?.password) return null;
        
        // Add logic here to look up the user from the credentials supplied
        const user = await userLogin(credentials.email, credentials.password);
        console.log(user);
        if(!user)
          return null; // = {status: 'NOK', message: 'Authentication failed. Make sure email and password combination are correct.'}  
        
        //const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

        //if (user) {
          // Any object returned will be saved in `user` property of the JWT
        //  return user
        //} else {
          // If you return null then an error will be displayed advising the user to check their details.
        //  return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        //}
        return {
          id: user?.id.toString(),
          email: user?.email,
          name: user?.name,
          type: user?.type
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user}) {
      console.log('[jwt]', {token, user});
      if(user)        
        return {
          ...token,
          ...{
            id: user.id,
            email: user.email,
            name: user.name,
            type: (user.type) ? user.type : null
          }
        }
      
      return token;
    },
    async session({ session, token, user }) {
      console.log('[session]', {session, token});
      return {
        ...session,        
        user: {
          ...session.user,
          ...{
            id: token.id,
            email: token.email,
            name: token.name,
            type: (token.type) ? token.type : null,    
          }
        },
      }
    },    
  },
}

export const getHandler = () => {
  return NextAuth(authOptions);
}