"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { authClient } from "@/lib/auth-client"

// Define User interface outside of the component
interface User {
  id: string;
  name: string;
  email: string;
}

export default function AddTeamPage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const [teamName, setTeamName] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setUsers([])
      setHasSearched(true)
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchInput.trim())}`)

      if (res.ok) {
        const data = await res.json()
        setUsers(data)
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

  const toggleSelectUser = (user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    )
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error("Team name is required")
      return
    }

    if (!session?.user) {
      toast.error("You must be logged in")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          memberIds: selectedUsers.map((u) => u.id),
        }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || "Failed to create team")
      }

      const data = await res.json()
      toast.success("Team created!")
      router.push(`/teams/${data.id}`)
    } catch (err: any) {
      toast.error(err.message || "Error creating team")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create Team</CardTitle>
              <CardDescription>Add name and members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />

              <div>
                <p className="text-sm font-medium mb-2">Selected Members</p>
                {selectedUsers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <Badge key={user.id} variant="secondary">
                        {user.name}
                        <button
                          className="ml-1"
                          onClick={() => toggleSelectUser(user)}
                        >
                          ✕
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No members selected</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCreateTeam}
                disabled={isLoading || !teamName.trim()}
                className="w-full"
              >
                {isLoading ? "Creating..." : "Create Team"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Search Users</CardTitle>
              <CardDescription>Enter a name or email and press Enter to search</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search users by name/email"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value)
                      // Clear users list when search input is cleared
                      if (!e.target.value.trim()) {
                        setUsers([])
                        setHasSearched(false)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleSearch()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {isLoading ? (
                  <div className="py-8 text-center">Searching...</div>
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
                              <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
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
                        {hasSearched
                          ? "No users found"
                          : "Type a name and press Enter to search"}
                      </div>
                    )}
                  </ScrollArea>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}