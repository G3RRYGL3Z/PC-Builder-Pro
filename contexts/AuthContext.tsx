import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
  name: string;
  builds_count: number;
  highest_performance_score: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-5314a707`;

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Check for demo token first
      const demoToken = localStorage.getItem('demo_token');
      if (demoToken === 'demo-token') {
        try {
          const response = await fetch(`${serverUrl}/auth/demo`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const { user } = await response.json();
            setUser(user);
            return;
          } else {
            localStorage.removeItem('demo_token');
          }
        } catch (error) {
          console.error('Demo auth check failed:', error);
          localStorage.removeItem('demo_token');
        }
      }
      
      // Check regular Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        try {
          const response = await fetch(`${serverUrl}/auth/session`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const { user } = await response.json();
            setUser(user);
          } else {
            // If server session check fails, clear local session
            await supabase.auth.signOut();
            setUser(null);
          }
        } catch (error) {
          console.error('Server session check failed:', error);
          // Keep user signed in locally even if server is unavailable
          // They can still use the app but won't have community features
        }
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Try server signup first
      try {
        const response = await fetch(`${serverUrl}/auth/signup`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, name })
        });
        
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'Failed to create account on server');
        }
        
        // If server signup succeeds, sign in
        await signIn(email, password);
      } catch (serverError) {
        console.error('Server signup failed:', serverError);
        // Fallback to local Supabase auth only
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Set minimal user info for local-only mode
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            name: name,
            builds_count: 0,
            highest_performance_score: 0
          });
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Check for demo credentials
      if (email === 'demo@pcbuilder.com' && password === 'demo123') {
        try {
          const response = await fetch(`${serverUrl}/auth/demo`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const { user, access_token } = await response.json();
            localStorage.setItem('demo_token', access_token);
            setUser(user);
            return;
          } else {
            throw new Error('Demo authentication failed');
          }
        } catch (demoError) {
          console.error('Demo auth failed:', demoError);
          throw new Error('Demo authentication is not available. Please try creating a new account.');
        }
      }
      
      // Regular Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.session?.access_token) {
        try {
          const response = await fetch(`${serverUrl}/auth/session`, {
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const { user } = await response.json();
            setUser(user);
          } else {
            // Server unavailable, use local auth data
            setUser({
              id: data.user.id,
              email: data.user.email || email,
              name: data.user.user_metadata?.name || 'User',
              builds_count: 0,
              highest_performance_score: 0
            });
          }
        } catch (serverError) {
          console.error('Server session failed:', serverError);
          // Use local auth data as fallback
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || 'User',
            builds_count: 0,
            highest_performance_score: 0
          });
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear demo token if present
      localStorage.removeItem('demo_token');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await checkUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}