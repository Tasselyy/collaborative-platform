"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Mail, Users, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import UserSearchSelector, { User } from "@/components/UserSearchSelector"

interface TeamMember {
  id: string
  name: string
  email: string
  image?: string
  role: string
  joinedAt: string
}

interface Team {
  id: string
  name: string
  plan: string
  members: TeamMember[]
  createdAt: string
}

export default function AddMembersPage() {
  const router = useRouter()
  const params = useParams()
  const teamId = params.teamId as string

  const [team, setTeam] = useState<Team | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [isAddingMembers, setIsAddingMembers] = useState(false)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`/api/teams/${teamId}`)
        if (!res.ok) throw new Error("Team not found")
        const data = await res.json()
        setTeam(data)
      } catch (error) {
        toast.error("Team not found. Redirecting...")
        router.push("/dashboard")
      }
    }

    fetchTeam()
  }, [teamId, router])

  const handleAddMembers = async () => {
    if (!team || selectedUsers.length === 0 || isAddingMembers) return

    setIsAddingMembers(true)
    try {
      console.log("Adding these users to the team:")
      selectedUsers.forEach(user => {
        console.log(`• ${user.name} <${user.email}> (id: ${user.id})`)
      })

      const res = await fetch(`/api/teams/${team.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          members: selectedUsers.map(u => ({ userId: u.id, role: "MEMBER" })),
        }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || "Failed to add members")
      }

      // Parse the response just to acknowledge it
      await res.json()

      // Refresh team data to update the members list
      const refreshRes = await fetch(`/api/teams/${teamId}`)
      if (refreshRes.ok) {
        const refreshedTeam = await refreshRes.json()
        setTeam(refreshedTeam)
      }

      console.log("About to show success toast")

      // Simple success toast
      toast("Members added", {
        description: `${selectedUsers.length} member${selectedUsers.length !== 1 ? "s" : ""} added to ${team.name}.`,
        action: {
          label: "View Team",
          onClick: () => router.push(`/teams/${team.id}`),
        },
      })

      console.log("After toast")

      setSelectedUsers([]) // Clear selection after successful add
    } catch (err) {
      // Use type assertion to access message property
      const error = err as Error
      toast.error(error.message || "Error adding members")
    } finally {
      setIsAddingMembers(false)
    }
  }

  if (!team) return null

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" onClick={() => router.push(`/teams/${teamId}`)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add Members to {team.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
              <CardDescription>Add members to {team.name}</CardDescription>
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
                    {team.members
                      .sort((a, b) => {
                        // Sort by role first (OWNER/Admin comes first)
                        if (a.role === "OWNER" && b.role !== "OWNER") return -1;
                        if (a.role !== "OWNER" && b.role === "OWNER") return 1;

                        // Then sort alphabetically by name
                        return a.name.localeCompare(b.name);
                      })
                      .map(member => (
                        <div key={member.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted">
                          <Avatar className="h-6 w-6">
                            {member.image ? (
                              <AvatarImage src={member.image} onError={(e) => {
                                // When image fails to load, hide the img element
                                (e.target as HTMLImageElement).style.display = 'none';
                              }} />
                            ) : null}
                            <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Mail className="h-2.5 w-2.5 mr-1" />
                              <span className="truncate">{member.email}</span>
                            </p>
                          </div>
                          {member.role === "OWNER" && (
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
                          onClick={() => setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))}
                        >
                          ✕
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
                disabled={selectedUsers.length === 0 || isAddingMembers}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isAddingMembers ? "Adding Members..." : "Add Members to Team"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Users</CardTitle>
              <CardDescription>Search and select users to add to your team</CardDescription>
            </CardHeader>
            <CardContent>
              <UserSearchSelector
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                disabledUserIds={team.members.map(m => m.id)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}