"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  ChevronLeft, 
  Users, 
  UserPlus, 
  Settings, 
  Trash2, 
  Mail
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Types
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

// Mock data (replace with API calls in production)
const mockTeam: Team = {
  id: "team1",
  name: "Acme Inc",
  plan: "Enterprise",
  description: "Main team for Acme Inc for data analysis and visualization",
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
}

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const router = useRouter()
  const [team, setTeam] = useState<Team>(mockTeam)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null)
  
  // Fetch team data (in production, replace with API call)
  useEffect(() => {
    // Example API call:
    // const fetchTeam = async () => {
    //   try {
    //     const response = await fetch(`/api/teams/${teamId}`);
    //     if (response.ok) {
    //       const data = await response.json();
    //       setTeam(data);
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch team:", error);
    //   }
    // };
    // fetchTeam();
    
    // For now, we'll use the mock data
    setTeam({
      ...mockTeam,
      id: teamId
    })
  }, [teamId])

  const handleRemoveMember = (memberId: string) => {
    setMemberToRemove(memberId)
    setIsDeleteConfirmOpen(true)
  }

  const confirmRemoveMember = () => {
    if (!memberToRemove) return
    
    // In production, make API call here
    setTeam({
      ...team,
      members: team.members.filter(member => member.id !== memberToRemove)
    })
    
    setMemberToRemove(null)
    setIsDeleteConfirmOpen(false)
    
    // Using Sonner toast
    toast.success("Member removed", {
      description: "The member has been removed from the team."
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2"
          onClick={() => router.push("/dashboard")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Team Details</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{team.name}</CardTitle>
                <Badge>{team.plan}</Badge>
              </div>
              <CardDescription>
                Team details and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {team.description || "No description available"}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Team ID</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {team.id}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Created</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {team.createdAt}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Members</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={() => router.push(`/teams/${team.id}/settings`)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2" id="members-section">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => router.push(`/teams/${team.id}/add-members`)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Members
                </Button>
              </div>
              <CardDescription>
                View and manage team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No team members</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Add team members to collaborate on projects.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => router.push(`/teams/${team.id}/add-members`)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Add Members
                    </Button>
                  </div>
                ) : (
                  <div>
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.image} />
                            <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{member.name}</p>
                              {member.role === "Admin" && (
                                <Badge variant="default" className="ml-2">Admin</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {member.email}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Total members: {team.members.length}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Confirm remove member dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove team member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member from the team?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemoveMember}>
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}