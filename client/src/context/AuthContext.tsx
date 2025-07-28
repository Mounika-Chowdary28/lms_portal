"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import { jwtDecode } from "jwt-decode"

export type AuthContextType = {
  user: {
    name: string
    email: string
    role: "student" | "instructor" | "admin"
  } | null
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"))
  const [user, setUser] = useState<AuthContextType["user"]>(null)

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        console.log("Decoded token:", decoded) // Debug log
        setUser({
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
        })
      } catch (error) {
        console.error("Error decoding token:", error)
        // Clear invalid token
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [token])

  const login = (newToken: string) => {
    console.log("Login called with token:", newToken) // Debug log
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
