export interface User {
    id?: number,
    email: string,
    name: string,
    type: string,
    password?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export type UserLogin = {
  email: string;
  password: string;
}

export type LoginResult = {
  error?: string,
  user: User
}