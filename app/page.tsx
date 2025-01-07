import { AppSidebar } from '@/components/Sidebar'

export default function RootPage() {
  return (
    <div className="flex min-h-svh">
      <AppSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Welcome to ChatGenius</h1>
        <p className="mt-4">Select a channel from the sidebar to get started.</p>
      </main>
    </div>
  )
}

