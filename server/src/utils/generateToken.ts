import jwt from "jsonwebtoken"
import type { UserDocument } from "../models/user_model"

export const generateToken = (user: UserDocument) => {
  return jwt.sign(
    {
      id: user.id.toString(), // Use 'id' instead of '_id' and convert to string
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  )
}