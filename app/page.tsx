'use client';

import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';
import { CurrentSidebar } from '../components/ui/current-sidebar';
import { useState } from 'react';

export default function Home() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!userId) {
    return (
      <main className="min-h-screen p-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-2xl font-bold mb-8">Welcome to ChatGenius</h1>
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
              Sign In
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen relative">
      <CurrentSidebar />
    </main>
  );
}

