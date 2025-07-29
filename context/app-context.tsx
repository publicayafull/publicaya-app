"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export enum UserType {
  PERSONAL = "user",
  EMPRESA = "company",
  ADMIN = "admin",
  NONE = "none", // Added for initial/unauthenticated state
}

interface UserProfile {
  id: string
  email: string
  userType: UserType
  name?: string | null
  balance?: number
  campaignBudget?: number
  referralCode?: string | null
  referredUsersCount?: number
}

interface AppContextType {
  user: UserProfile | null
  userType: UserType
  isLoadingUser: boolean
  login: (user: UserProfile) => void
  logout: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null)
  const [userType, setUserTypeState] = useState<UserType>(UserType.NONE)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchUserSession = async () => {
      setIsLoadingUser(true)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        setUserState(null)
        setUserTypeState(UserType.NONE)
        setIsLoadingUser(false)
        return
      }

      // Fetch profile if session exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, role, name, balance, campaign_budget, referral_code, referred_users_count")
        .eq("id", session.user.id)
        .single()

      if (profileError || !profile) {
        console.error("Error fetching profile:", profileError?.message)
        setUserState(null)
        setUserTypeState(UserType.NONE)
        toast({
          title: "Error",
          description: "Failed to load user profile.",
          variant: "destructive",
        })
      } else {
        const userProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || "",
          userType: profile.role as UserType,
          name: profile.name || session.user.user_metadata.full_name,
          balance: profile.balance,
          campaignBudget: profile.campaign_budget,
          referralCode: profile.referral_code,
          referredUsersCount: profile.referred_users_count,
        }
        setUserState(userProfile)
        setUserTypeState(userProfile.userType)
      }
      setIsLoadingUser(false)
    }

    fetchUserSession()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        fetchUserSession() // Re-fetch user and profile on auth state change
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase, toast])

  const login = (userProfile: UserProfile) => {
    setUserState(userProfile)
    setUserTypeState(userProfile.userType)
  }

  const logout = async () => {
    setIsLoadingUser(true) // Set loading state during logout
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error.message)
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      })
    } else {
      setUserState(null)
      setUserTypeState(UserType.NONE)
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      })
    }
    setIsLoadingUser(false) // Reset loading state after logout
  }

  return <AppContext.Provider value={{ user, userType, isLoadingUser, login, logout }}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider")
  }
  return context
}
