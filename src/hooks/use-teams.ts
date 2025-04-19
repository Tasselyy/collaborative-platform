// hooks/use-teams.ts
import { useState, useEffect } from 'react'
import { authClient } from '@/lib/auth-client'

export type Team = {
  id: string;
  name: string;
  description?: string;
  role: string;
  joinedAt: string;
}

export function useTeams() {
  const { data: session } = authClient.useSession();
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!session || !session.user || !session.user.id) {
        setTeams([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/teams/curUser');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setTeams(data.teams);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err instanceof Error ? err.message : 'Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [session]);

  return { teams, loading, error };
}