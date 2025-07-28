import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS - Allow frontend to connect
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" })
})

// Import and use routes
import authRoutes from "./routes/auth"
import courseRoutes from "./routes/course"
import instructorRoutes from "./routes/instructor"

app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/instructor", instructorRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Start server
const startServer = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI)
      console.log("✅ MongoDB connected")
    } else {
      console.log("⚠️ No MONGO_URI found, running without database")
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("❌ Server startup error:", error)
    process.exit(1)
  }
}

startServer()
