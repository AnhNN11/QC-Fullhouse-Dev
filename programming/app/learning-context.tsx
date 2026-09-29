"use client";
import { createContext, useContext } from 'react';
import type { SessionUser } from '@/lib/user-auth';
export const LearningContext = createContext<{ user: SessionUser | null; setUser: (user: SessionUser | null) => void; query: string; setQuery: (query: string) => void } | null>(null);
export function useLearningContext() { return useContext(LearningContext); }
