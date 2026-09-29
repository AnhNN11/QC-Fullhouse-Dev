'use client';
import { useState } from 'react';
import { LearningContext } from './learning-context';
import type { SessionUser } from '@/lib/user-auth';
export default function PublicSession({initialUser,children}:{initialUser:SessionUser|null;children:React.ReactNode}){
 const [user,setUser]=useState(initialUser),[previous,setPrevious]=useState(initialUser),[query,setQuery]=useState('');
 if(previous!==initialUser){setPrevious(initialUser);setUser(initialUser);}
 return <LearningContext.Provider value={{user,setUser,query,setQuery}}>{children}</LearningContext.Provider>;
}
