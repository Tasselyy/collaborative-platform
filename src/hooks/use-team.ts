import { useState, useEffect, createContext, useContext } from "react";
import { useSession } from "next-auth/react";

const TeamContext = createContext<any>(null);

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTeam, setActiveTeam] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const savedTeam = localStorage.getItem("activeTeam");
    if (savedTeam) setActiveTeam(savedTeam);
  }, []);

  const switchTeam = (teamId: string) => {
    setActiveTeam(teamId);
    localStorage.setItem("activeTeam", teamId);
  };

  return (
    <TeamContext.Provider value={{ activeTeam, switchTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
