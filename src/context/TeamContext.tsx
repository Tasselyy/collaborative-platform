// src/context/TeamContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { Team } from "@/hooks/use-teams";

type TeamContextType = {
  activeTeam: Team | null;
  setActiveTeam: (team: Team | null) => void;
};

const TeamContext = createContext<TeamContextType>({
  activeTeam: null,
  setActiveTeam: () => {},
});

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  return (
    <TeamContext.Provider value={{ activeTeam, setActiveTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);