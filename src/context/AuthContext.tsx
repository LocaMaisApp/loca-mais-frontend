import cookie from "cookiejs";
import type { ReactNode } from "react";
import { createContext, useEffect, useMemo, useState } from "react";

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

// Funções utilitárias para localStorage
const saveUserToStorage = (user: User) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Erro ao salvar usuário no localStorage:", error);
  }
};

const getUserFromStorage = (): User | null => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Erro ao recuperar usuário do localStorage:", error);
    return null;
  }
};

const removeUserFromStorage = () => {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Erro ao remover usuário do localStorage:", error);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Recuperar dados do usuário do localStorage na inicialização
  useEffect(() => {
    const savedUser = getUserFromStorage();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    const token = cookie.get("token");
    if (!token) {
      signOut();
    }
  }, []);

  const userType = useMemo(() => {
    return user ? user.type : null;
  }, [user]);

  const signIn = (userData: User, accessToken: string) => {
    cookie.set("token", accessToken, {
      expires: 1 / 24,
    });
    setUser(userData);
    saveUserToStorage(userData);
  };

  const signOut = () => {
    cookie.remove("token");
    setUser(null);
    removeUserFromStorage();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, userType, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
