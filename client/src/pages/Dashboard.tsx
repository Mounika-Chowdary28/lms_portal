"use client"

import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "../context/AuthContext"
import StudentDashboard from "./dashboard/StudentDashboard"
import InstructorDashboard from "./dashboard/instructor/InstructorDashboard"
import AdminDashboard from "./dashboard/AdminDashboard"

const Dashboard = () => {
  const { user, logout } = useAuth() // This should now work without type errors
  const navigate = useNavigate()

  // Redirect to login if no user
  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" })
    }
  }, [user, navigate])

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate({ to: "/login" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 px-4 py-10">
      <div className="w-full max-w-5xl bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 text-white">
        {/* User Profile Card */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-semibold">{user.name}</p>
              <p className="text-sm text-gray-200">{user.email}</p>
              <p className="text-sm text-gray-300 capitalize">🧾 Role: {user.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300"
          >
            🔓 Logout
          </button>
        </div>

        {/* Role-based Dashboard */}
        {user.role === "student" && (
          <>
            <h3 className="text-2xl font-bold mb-4">🎓 Student Dashboard</h3>
            <StudentDashboard />
          </>
        )}

        {user.role === "instructor" && (
          <>
            <h3 className="text-2xl font-bold mb-4">🧑‍🏫 Instructor Dashboard</h3>
            <InstructorDashboard />
          </>
        )}

        {user.role === "admin" && (
          <>
            <h3 className="text-2xl font-bold mb-4">🛡 Admin Dashboard</h3>
            <AdminDashboard />
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
