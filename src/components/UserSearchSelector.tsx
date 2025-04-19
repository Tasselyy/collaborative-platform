// components/UserSearchSelector.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

export interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface Props {
  selectedUsers: User[]
  setSelectedUsers: (users: User[]) => void
  disabledUserIds?: string[] // optional, to exclude users (e.g. current team members)
}

export default function UserSearchSelector({ selectedUsers, setSelectedUsers, disabledUserIds = [] }: Props) {
  const [searchInput, setSearchInput] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const search = async () => {
      if (!searchInput.trim()) return setUsers([])

      setIsLoading(true)
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchInput.trim())}`)
        if (res.ok) {
          const data: User[] = await res.json()
          const filtered = data.filter(u => !disabledUserIds.includes(u.id))
          setUsers(filtered)
        } else {
          toast.error("Failed to search users")
        }
      } catch (err) {
        console.error("Search error:", err)
        toast.error("Error searching users")
      } finally {
        setIsLoading(false)
      }
    }

    const timeout = setTimeout(() => {
      search()
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchInput, disabledUserIds])

  const toggleSelectUser = (user: User) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users by name/email"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full"
      />

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Searching...</div>
      ) : (
        <ScrollArea className="h-72 border rounded-md">
          {users.length > 0 ? (
            <div className="p-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => toggleSelectUser(user)}
                >
                  <Avatar className="h-8 w-8">
                    {user.image ? (
                      <AvatarImage src={user.image} />
                    ) : (
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="h-6 w-6 rounded-full border flex items-center justify-center">
                    {selectedUsers.some((u) => u.id === user.id) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {searchInput.trim() ? "No users found" : "Start typing to search for users"}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  )
}
