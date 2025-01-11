"use client"

import * as React from "react"

interface ModalCreateChannelProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, description: string) => void
}

export function ModalCreateChannel({ isOpen, onClose, onSubmit }: ModalCreateChannelProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(name, description)
    setName("")
    setDescription("")
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1a1f2e] p-6 rounded-lg shadow-xl z-50">
        <h2 className="text-xl font-semibold mb-4 text-[#8ba3d4]">Create Channel</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#8ba3d4] mb-2">
              Channel Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#566388]">#</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#242b3d] text-[#8ba3d4] rounded-md px-4 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-[#3d4663] placeholder-[#566388]"
                placeholder="new-channel"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#8ba3d4] mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#242b3d] text-[#8ba3d4] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3d4663] placeholder-[#566388]"
              placeholder="What's this channel about?"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#8ba3d4] hover:bg-[#242b3d] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#242b3d] text-[#8ba3d4] rounded-md hover:bg-[#2a3142] transition-colors disabled:opacity-50"
              disabled={!name.trim()}
            >
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </>
  )
} 