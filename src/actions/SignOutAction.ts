'use server'

import { signOut } from '@/auth';
import { redirect } from 'next/navigation';

export async function SignOutAction() {
    // CONNECT DB
    await signOut();

    // Redirect to the home page
    redirect('/');
}
