import { SessionUser } from "@/lib/auth";
import { createContext, useContext } from "react";

const UserContext = createContext<SessionUser | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: SessionUser | null;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(){
    return useContext(UserContext)
}