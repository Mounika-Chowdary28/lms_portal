import mongoose, { type Document, Schema } from "mongoose"

export interface CourseDocument extends Document {
  title: string
  description: string
  instructor: mongoose.Types.ObjectId
  studentIds: mongoose.Types.ObjectId[]
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  rating: number
  price: string
  syllabus: string[]
  prerequisites: string[]
  learningOutcomes: string[]
  totalLessons: number
  estimatedHours: number
  language: string
  certificate: boolean
  status: "draft" | "published" | "archived"
  thumbnail?: string
  videoIntro?: string
  createdAt: Date
  updatedAt: Date
}

const courseSchema = new Schema<CourseDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    duration: {
      type: String,
      required: true,
      default: "8 weeks",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
      default: "Beginner",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    price: {
      type: String,
      required: true,
      default: "$99",
    },
    syllabus: [
      {
        type: String,
        trim: true,
      },
    ],
    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],
    learningOutcomes: [
      {
        type: String,
        trim: true,
      },
    ],
    totalLessons: {
      type: Number,
      default: 0,
      min: 0,
    },
    estimatedHours: {
      type: Number,
      default: 40,
      min: 0,
    },
    language: {
      type: String,
      default: "English",
      trim: true,
    },
    certificate: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    videoIntro: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Add indexes for better performance
courseSchema.index({ instructor: 1 })
courseSchema.index({ category: 1 })
courseSchema.index({ level: 1 })
courseSchema.index({ status: 1 })
courseSchema.index({ title: "text", description: "text" })

const Course = mongoose.model<CourseDocument>("Course", courseSchema)
export default Course
