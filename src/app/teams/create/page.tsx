"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Search, Check, UserPlus } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Types
type User = {
  id: string
  name: string
  email: string
  image?: string
}

export default function AddTeamPage() {
  const router = useRouter()
  const [teamName, setTeamName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  
  // Mock users - in production, you would fetch from API
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com", image: "/avatars/john.jpg" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", image: "/avatars/jane.jpg" },
    { id: "3", name: "Alice Johnson", email: "alice@example.com" },
    { id: "4", name: "Bob Brown", email: "bob@example.com" },
    { id: "5", name: "Charlie Green", email: "charlie@example.com" },
    { id: "6", name: "Diana White", email: "diana@example.com" }
  ])

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelectUser = (user: User) => {
    if (selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.error("Error", {
        description: "Team name cannot be empty"
      })
      return
    }

    // Here you would make an API call to create the team
    console.log("Creating team:", {
      name: teamName,
      members: selectedUsers
    })

    toast.success("Team created", {
      description: `${teamName} has been created successfully.`
    })

    // Navigate back to dashboard or team management page
    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Team</CardTitle>
              <CardDescription>
                Add a name and members to your new team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="teamName" className="text-sm font-medium">
                      Team Name
                    </label>
                    <Input
                      id="teamName"
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Team Members</p>
                    {selectedUsers.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedUsers.map(user => (
                          <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                            {user.name}
                            <button 
                              type="button" 
                              className="ml-1 rounded-full hover:bg-muted"
                              onClick={() => toggleSelectUser(user)}
                            >
                              <svg
                                
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-2">No members selected</p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCreateTeam}
                disabled={!teamName.trim()}
                className="w-full"
              >
                Create Team
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Team Members</CardTitle>
              <CardDescription>
                Search and select users to add to your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Command className="rounded-lg border shadow-md">
                <CommandInput 
                  placeholder="Search users by name or email..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandGroup heading="Users">
                    <ScrollArea className="h-72">
                      {filteredUsers.map(user => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => toggleSelectUser(user)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image} />
                            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border">
                            <Check className={`h-3 w-3 ${
                              selectedUsers.some(selectedUser => selectedUser.id === user.id) 
                                ? "opacity-100" 
                                : "opacity-0"
                            }`} />
                          </div>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}