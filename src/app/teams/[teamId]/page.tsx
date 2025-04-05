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
import { authClient } from "@/lib/auth-client"

// Types
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface TeamMember {
  id: string; // user id
  name: string;
  email: string;
  image?: string;
  role: string;
  joinedAt?: string;
}

interface Team {
  id: string;
  name: string;
  createdAt: string;
  members: TeamMember[];
}

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  // Fetch team data
  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/teams/${teamId}`);
        

        if (!response.ok) {
          throw new Error(`Failed to fetch team: ${response.status}`);
        }
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error("Error fetching team:", error);
        toast.error("Failed to load team details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  const handleRemoveMember = (memberId: string) => {
    setMemberToRemove(memberId);
    setIsDeleteConfirmOpen(true);
  }

  const confirmRemoveMember = async () => {
    if (!memberToRemove || !team) return;

    try {
      const response = await fetch(`/api/teams/${team.id}/members/${memberToRemove}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to remove member: ${response.status}`);
      }

      // Update local state
      setTeam({
        ...team,
        members: team.members.filter(member => member.id !== memberToRemove)
      });

      toast.success("Member removed", {
        description: "The member has been removed from the team."
      });
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    } finally {
      setMemberToRemove(null);
      setIsDeleteConfirmOpen(false);
    }
  }

  // Check if the current user is a team admin
  const isUserAdmin = team?.members.some(
    member => member.id === session?.user?.id && member.role === "OWNER"
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Team not found</h2>
          <p className="mt-2 text-muted-foreground">The team you're looking for doesn't exist or you don't have access to it.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/dashboard")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
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
              </div>
              <CardDescription>
                Team details and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Team ID</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {team.id}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Created</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(team.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Members</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                </p>
              </div>
            </CardContent>
            {/* {isUserAdmin && (
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={() => router.push(`/teams/${team.id}/settings`)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </CardFooter>
            )} */}
          </Card>
        </div>

        <div className="md:col-span-2" id="members-section">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                {isUserAdmin && (
                  <Button
                    size="sm"
                    onClick={() => router.push(`/teams/${team.id}/add-members`)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Members
                  </Button>
                )}
              </div>
              <CardDescription>
                View and manage team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Replace the existing members mapping code with this: */}
                {team.members
                  .sort((a, b) => {
                    // Sort by role first (OWNER/Admin comes first)
                    if (a.role === "OWNER" && b.role !== "OWNER") return -1;
                    if (a.role !== "OWNER" && b.role === "OWNER") return 1;

                    // Then sort alphabetically by name
                    return a.name.localeCompare(b.name);
                  })
                  .map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-6 w-6">
                          {member.image ? (
                            <AvatarImage src={member.image} onError={(e) => {
                              // When image fails to load, hide the img element
                              (e.target as HTMLImageElement).style.display = 'none';
                            }} />
                          ) : null}
                          <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{member.name}</p>
                            <Badge variant="default" className="ml-2">
                              {member.role === "OWNER" ? "Admin" : "Member"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {member.email}
                          </p>
                        </div>
                      </div>
                      {isUserAdmin && member.role !== "OWNER" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
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