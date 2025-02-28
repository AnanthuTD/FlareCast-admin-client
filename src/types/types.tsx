export interface User {
  id: string;
  email: string;
  [key: string]: any; 
}

export interface UserState {
  user: User | null;          
  isAuthenticated: boolean; 
  loading: boolean;           
  error: string | null;     
}

export interface Credentials {
  email: string;
  password: string;
}

export interface LoginPayload {
  user: User;
}