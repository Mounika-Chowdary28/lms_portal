import { Router } from "express"
import bcrypt from "bcryptjs"
import User from "../models/user_model"
import { generateToken } from "../utils/generateToken"

const router = Router()

// Test endpoint to verify server is running
router.get("/test", (req, res) => {
  res.json({ message: "Auth server is running!", timestamp: new Date().toISOString() })
})

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    const token = generateToken(user)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: unknown) {
    console.error("Register error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    res.status(500).json({ message: "Server error", details: errorMessage })
  }
})

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    const errorStack = error instanceof Error ? error.stack : "No stack trace available"

    console.error("Login error details:", {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    })
    res.status(500).json({ message: "Server error during login", details: errorMessage })
  }
})

// GET /api/auth/test-users - For testing only
router.get("/test-users", async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    res.status(500).json({ message: "Error fetching users", details: errorMessage })
  }
})

export default router
