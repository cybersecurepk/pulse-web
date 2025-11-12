"use client";

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface Session {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface SessionContextValue {
  data: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update: () => Promise<Session | null>;
}

/**
 * A custom hook that retrieves session data from localStorage.
 * @returns {SessionContextValue} An object containing session data, status, and update function.
 */
export function useSafeSession(): SessionContextValue {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    if (typeof window === 'undefined') {
      setStatus('loading');
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');

      if (accessToken && refreshToken && userStr) {
        const user = JSON.parse(userStr);
        setSession({
          user,
          accessToken,
          refreshToken,
        });
        setStatus('authenticated');
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
    } catch (error) {
      console.error('Error reading session from localStorage:', error);
      setSession(null);
      setStatus('unauthenticated');
    }
  }, []);

  const update = async (): Promise<Session | null> => {
    // Re-read from localStorage
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');

      if (accessToken && refreshToken && userStr) {
        const user = JSON.parse(userStr);
        const newSession = {
          user,
          accessToken,
          refreshToken,
        };
        setSession(newSession);
        setStatus('authenticated');
        return newSession;
      } else {
        setSession(null);
        setStatus('unauthenticated');
        return null;
      }
    } catch (error) {
      console.error('Error updating session:', error);
      setSession(null);
      setStatus('unauthenticated');
      return null;
    }
  };

  if (typeof window === 'undefined') {
    // Mock behavior during SSR/static builds
    return { data: null, status: 'loading', update: async () => null };
  }

  return { data: session, status, update };
}