import { createContext, useContext, useState, ReactNode } from 'react';
import api from '../services/api';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined >(undefined);

export function AuthProvider({ children }: { children:ReactNode }){
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      nome: '',
      email,
      senha: password,
    });
    
    const { access_token } = response.data;
    
    localStorage.setItem('token', access_token);

    const userData = {name: 'Admin NexusTech', email};
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  }

  return(
    <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  const context = useContext(AuthContext);
  if (!context){
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context;
}