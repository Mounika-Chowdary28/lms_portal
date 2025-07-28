"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "../api/axios" // Use the configured axios instance
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.string().oneOf(["student", "instructor", "admin"]).required("Role is required"),
})

type FormData = yup.InferType<typeof schema>

const Register = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      console.log("Attempting registration with:", data.email)

      // Use the configured axios instance
      const res = await axios.post("/auth/register", data)
      console.log("Registration response:", res.data)

      alert("Registration successful! Please login.")
      navigate({ to: "/login" })
    } catch (err: any) {
      console.error("Registration error:", err)
      const errorMessage = err?.response?.data?.message || err?.message || "Registration failed"
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 px-4">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6">Create Your LMS Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("name")}
              placeholder="🙍‍♂ Full Name"
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-red-300 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...register("email")}
              placeholder="📧 Email Address"
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-300 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="🔒 Create Password"
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
              disabled={isLoading}
            />
            {errors.password && <p className="text-sm text-red-300 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <select
              {...register("role")}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white appearance-none"
              disabled={isLoading}
            >
              <option value="" className="text-black">
                📚 Select Role
              </option>
              <option value="student" className="text-black">
                🎓 Student
              </option>
              <option value="instructor" className="text-black">
                🧑‍🏫 Instructor
              </option>
              <option value="admin" className="text-black">
                🛡 Admin
              </option>
            </select>

            {errors.role && <p className="text-sm text-red-300 mt-1">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-lg text-white font-semibold border border-white border-opacity-30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "🔄 Registering..." : "🚀 Register"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
