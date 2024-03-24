// don't forget the npx prisma generate, the two lines below is taken from it
// import { Prisma } from '@prisma/client'
//import { PrismaClient, Prisma } from '@prisma/client'
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient()
// import prisma from "./prisma";
import prisma from './db';
import { User } from '@/types/userTypes';

export async function createUser(userData: User) {
  try{
    const newUser = await prisma.user.create({
      data: userData,
    });
    return newUser;
  } catch (e) {
    let message = 'An unknown error is encountered while creating the data. Please try again!';
    //if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      // Constraint types or Unique values
      if (e?.code === 'P2002') {
        if(e?.meta.target?.toLowerCase() === 'user_email_key')
          message = 'Email address already exists in the database.';
        // add more validations here for the code like required fields
      }
    //}
    // throw e
    return { error: message };
  }
}

export async function userLogin(email: string, password: string) {

  try{
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password
      },
    });
    
    return user;
  } catch (e) {
    // TODO: if there's a need, save to database or to a log file
    console.log({ error: 'Database related issue has been encountered. Please try again later.' });

    return;
  }
}

export async function getUsers() {
  try{
    const users = await prisma.user.findMany();
    // console.log(users);
    return users;
  } catch (error) {
    console.log('QUERY ERROR')
    console.log(error)
    return { error };
  }

}

