import type { Request, Response, NextFunction } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import User, { type UserDocument } from "../models/user_model"

export interface AuthenticatedRequest extends Request {
  user?: UserDocument
}

// Middleware to protect routes (JWT auth)
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { id: string }

    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

// Middleware to allow only instructors
export const instructorOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "instructor") {
    return res.status(403).json({ message: "Access denied. Instructors only." })
  }

  next()
}

// Middleware to allow only admins
export const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." })
  }

  next()
}

// Middleware to allow only students
export const studentOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied. Students only." })
  }

  next()
}
