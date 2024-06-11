'use server';

import { signOut } from '@/auth.config';

import { redirect } from "next/navigation";


export const logout = async() => {

  await signOut();

  redirect("/auth/login");

}