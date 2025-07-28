import express from "express";
import User from "../models/user_model";
import Course from "../models/course_model";
import { protect, studentOnly, AuthenticatedRequest } from "../middleware/auth_middleware";
import mongoose from "mongoose";

const router = express.Router();

// Get available courses (not enrolled)
router.get("/courses/available", protect, studentOnly, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!._id;
  const courses = await Course.find({ students: { $ne: userId } }).populate("instructor", "name");
  res.json(courses);
});

// Enroll in a course
router.post("/courses/:id/enroll", protect, studentOnly, async (req: AuthenticatedRequest, res) => {
  const userId = new mongoose.Types.ObjectId(req.user!.id);
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  if (course.studentIds.some((studentId) => studentId.equals(userId)))
    return res.status(400).json({ message: "Already enrolled" });
  course.studentIds.push(userId);
  await course.save();
  res.json({ message: "Enrolled successfully" });
});

// Get registered courses
router.get("/courses/registered", protect, studentOnly, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!._id;
  const courses = await Course.find({ students: userId }).populate("instructor", "name");
  res.json(courses);
});

// Get student profile
router.get("/profile", protect, studentOnly, async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user!._id).select("-password");
  res.json(user);
});

// Update student profile
router.put("/profile", protect, studentOnly, async (req: AuthenticatedRequest, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(req.user!._id, { name, email }, { new: true }).select("-password");
  res.json(user);
});

export default router;
