import cookie from "cookiejs";
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
  type: "LANDLORD" | "TENANT";
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userType: "LANDLORD" | "TENANT" | null;
  signIn: (userData: User, accessToken: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<UserContextType | undefined>(undefined);

export const AuthProvider= ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const userType = useMemo(() => {
    return user ? user.type : null;
  }, [user]);


  const signIn = (userData: User,accessToken:string) => {
    cookie.set("token", accessToken, {
      expires: 1/24 
    });
    setUser(userData);
  }

  const signOut = () => {
    cookie.remove("accessToken");
    setUser(null);
  }


  return (
    <AuthContext.Provider value={{ user, setUser,userType,signIn,signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
