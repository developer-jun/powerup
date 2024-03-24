"use server"
// import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function callServerRedirect(url:string) {
  return await NextResponse.redirect(url); 
}