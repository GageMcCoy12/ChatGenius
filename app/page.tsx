'use client';

import { CurrentSidebar } from '../components/ui/current-sidebar'
import { useAuth } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'
import { useEffect } from 'react';

export default function RootPage() {
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    async function createUser() {
      if (userId) {
        try {
          const response = await fetch('/api/auth/user', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            const error = await response.json();
            console.error('Error creating user:', error);
            return;
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }
    }

    createUser();
  }, [userId]);

  if (!isLoaded) {
    return null;
  }

  if (!userId) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to ChatGenius</h1>
          <p className="text-lg mb-8">Sign in to get started with real-time chat.</p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh">
      <CurrentSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Welcome to ChatGenius</h1>
        <p className="mt-4">Select a channel from the sidebar to get started.</p>
      </main>
    </div>
  )
}

