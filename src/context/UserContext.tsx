import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

export interface User {
  id: number;
  name: string;
  lastName: string;
  cpf: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  type: "landlord" | "tenant";
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userType: "landlord" | "tenant" | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const userType = useMemo(() => {
    return user ? user.type : null;
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser,userType }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
