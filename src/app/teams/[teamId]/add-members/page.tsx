"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Search, Check, UserPlus, Users, Mail } from "lucide-react"
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

type TeamMember = {
  id: string
  name: string
  email: string
  image?: string
  role: string
  joinedAt: string
}

type Team = {
  id: string
  name: string
  plan: string
  description?: string
  members: TeamMember[]
  createdAt: string
}

// Mock users - in production, you would fetch from API
const mockAvailableUsers: User[] = [
  { id: "4", name: "Bob Brown", email: "bob@example.com" },
  { id: "5", name: "Charlie Green", email: "charlie@example.com" },
  { id: "6", name: "Diana White", email: "diana@example.com" },
  { id: "7", name: "Edward Black", email: "edward@example.com" },
  { id: "8", name: "Fiona Gray", email: "fiona@example.com" },
  { id: "9", name: "George Blue", email: "george@example.com" },
  { id: "10", name: "Helen Pink", email: "helen@example.com" },
  { id: "11", name: "Ivan Orange", email: "ivan@example.com" },
  { id: "12", name: "Julia Purple", email: "julia@example.com" }
]

// Mock teams data - in production, you would fetch from API
const mockTeams: Record<string, Team> = {
  "team1": {
    id: "team1",
    name: "Acme Inc",
    plan: "Enterprise",
    description: "Main team for Acme Inc",
    members: [
      { 
        id: "1", 
        name: "John Doe", 
        email: "john@example.com", 
        image: "/avatars/john.jpg",
        role: "Admin",
        joinedAt: "2023-05-12"
      },
      { 
        id: "2", 
        name: "Jane Smith", 
        email: "jane@example.com", 
        image: "/avatars/jane.jpg",
        role: "Member",
        joinedAt: "2023-06-18"
      },
      { 
        id: "3", 
        name: "Alice Johnson", 
        email: "alice@example.com",
        role: "Member",
        joinedAt: "2023-07-22"
      }
    ],
    createdAt: "2023-01-15"
  },
  "team2": {
    id: "team2",
    name: "Startup Co",
    plan: "Pro",
    description: "A promising startup",
    members: [
      { 
        id: "1", 
        name: "John Doe", 
        email: "john@example.com", 
        image: "/avatars/john.jpg",
        role: "Admin",
        joinedAt: "2023-04-10"
      }
    ],
    createdAt: "2023-03-22"
  }
}

export default function AddMembersPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  
  // Fetch team data (in production, replace with API call)
  useEffect(() => {
    // Simulate API loading
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Try to find team in mock data
      const foundTeam = mockTeams[teamId]
      
      // If team not found, create a fallback team with the ID
      if (foundTeam) {
        setTeam(foundTeam)
      } else {
        setTeam({
          id: teamId,
          name: `Team ${teamId}`,
          plan: "Free",
          description: "A team",
          members: [],
          createdAt: new Date().toISOString().split('T')[0]
        })
      }
      
      setIsLoading(false)
    }, 100)
  }, [teamId])

  // Get available users (users not in the team)
  const availableUsers = team 
    ? mockAvailableUsers.filter(user => 
        !team.members.some(member => member.id === user.id) &&
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : []

  const toggleSelectUser = (user: User) => {
    if (selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleAddMembers = () => {
    if (!team || selectedUsers.length === 0) return

    // In production, make API call here to add members to the team
    console.log("Adding members to team:", team.id, selectedUsers)
    
    // Simulate successful API call
    toast.success("Members added", {
      description: `${selectedUsers.length} member${selectedUsers.length > 1 ? 's' : ''} added to ${team.name}.`
    })

    // Navigate back to team detail page
    router.push(`/teams/${team.id}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading team information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground">Team not found. Redirecting...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2"
          onClick={() => router.push(`/teams/${team.id}`)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add Members to Team</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
              <CardDescription>
                Add members to {team.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{team.name}</p>
                  <p className="text-xs text-muted-foreground">{team.plan} Plan</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium mb-2">Current Members ({team.members.length})</p>
                
                {team.members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No members in this team yet</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {team.members.map(member => (
                      <div key={member.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.image} />
                          <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="text-xs font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Mail className="h-2.5 w-2.5 mr-1" /> 
                            <span className="truncate">{member.email}</span>
                          </p>
                        </div>
                        {member.role === "Admin" && (
                          <Badge variant="default" className="ml-auto text-[10px] py-0 px-1.5 h-4">Admin</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium mb-2">Selected Users</p>
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
                            xmlns="http://www.w3.org/2000/svg"
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
                  <p className="text-sm text-muted-foreground mb-2">No users selected</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAddMembers}
                disabled={selectedUsers.length === 0}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Members to Team
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Users</CardTitle>
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
                  <CommandGroup heading="Available Users">
                    <ScrollArea className="h-72">
                      {availableUsers.length === 0 && !searchQuery ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm text-muted-foreground">
                            All available users are already in this team.
                          </p>
                        </div>
                      ) : availableUsers.length === 0 && searchQuery ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm text-muted-foreground">
                            No users found matching "{searchQuery}".
                          </p>
                        </div>
                      ) : (
                        availableUsers.map(user => (
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
                        ))
                      )}
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