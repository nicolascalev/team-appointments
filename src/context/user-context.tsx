'use client'

import { createContext, useContext, useState } from 'react'
import { getCurrentUser } from '@/actions/auth'
import type { User } from '../../prisma/generated/client'

type UserContextType = {
  user: User | null
  loading: boolean
  refetchUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

type UserProviderProps = {
  children: React.ReactNode
  initialUser: User | null
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [loading, setLoading] = useState(false)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{ user, loading, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 