'use client';

import { use } from 'react';
import { useUser } from '@clerk/nextjs';
import { Chat } from '@/components/Chat';
import { redirect } from 'next/navigation';

export default function DirectMessagePage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = use(params);
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/sign-in');
  }

  // Prevent messaging yourself
  if (user.id === resolvedParams.userId) {
    redirect('/');
  }
  
  // Sort the IDs alphabetically to ensure consistency
  const sortedIds = [user.id, resolvedParams.userId].sort();
  // Create a unique channel ID by joining the sorted IDs
  const channelId = `dm-${sortedIds.join('-')}`;
  
  return (
    <div className="flex flex-col h-full pt-16">
      <div className="flex-grow">
        <Chat channelId={channelId} />
      </div>
    </div>
  );
} 