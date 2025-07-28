import mongoose, { type Document, Schema } from "mongoose"

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  role: "student" | "instructor" | "admin"
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
})

const User = mongoose.model<UserDocument>("User", userSchema)
export default User
