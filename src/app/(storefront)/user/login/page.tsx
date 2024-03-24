'use client';
import LoginForm from '@/components/user/login-form';
import './login.scss';



const metadata = {
  title: 'User Login',
  description: '',
}

export default function Login() {
  return (
    <div className="login-page">
      <LoginForm />
    </div>
  ); 
}