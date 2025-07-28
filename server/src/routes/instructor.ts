import { Router } from "express"
import Course from "../models/course_model"
import { protect, instructorOnly } from "../middleware/auth_middleware"

const router = Router()

// GET /api/instructor/courses
router.get("/courses", protect, instructorOnly, async (req: any, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate("instructor", "name email")
      .populate("studentIds", "name email")
    res.json(courses)
  } catch (error) {
    res.status(500).json({ message: "Error fetching instructor courses" })
  }
})

export default router
