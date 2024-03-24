'use client';
import { useState } from "react";
import UserContextProvider from '@/app/admin/contexts/userContext';
export default function Layout({ children }: { children: React.ReactNode }) {

  // const 

  return (
    <UserContextProvider>
      <div className="block">   
        <section>Heading</section>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        <footer>Footer</footer>
      </div>
    </UserContextProvider>
  );
}