import express from "express";
import User from "../models/user_model";
import Course from "../models/course_model";
import { protect, adminOnly, AuthenticatedRequest } from "../middleware/auth_middleware";

const router = express.Router();

// View all users (filter by role)
router.get("/users", protect, adminOnly, async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter);
  res.json(users);
});

// Add instructor
router.post("/instructors", protect, adminOnly, async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password, role: "instructor" });
  await user.save();
  res.status(201).json(user);
});

// Update instructor
router.put("/instructors/:id", protect, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
  res.json(user);
});

// Delete instructor
router.delete("/instructors/:id", protect, adminOnly, async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: "Instructor deleted" });
});

// Add course
router.post("/courses", protect, adminOnly, async (req, res) => {
  const { title, description, instructor } = req.body;
  const course = new Course({ title, description, instructor, students: [] });
  await course.save();
  res.status(201).json(course);
});

// Update course
router.put("/courses/:id", protect, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { title, description, instructor } = req.body;
  const course = await Course.findByIdAndUpdate(id, { title, description, instructor }, { new: true });
  res.json(course);
});

// Delete course
router.delete("/courses/:id", protect, adminOnly, async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  res.json({ message: "Course deleted" });
});

// View enrolled students in a course
router.get("/courses/:id/enrollments", protect, adminOnly, async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate("students", "name email");
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course.studentIds);
});

export default router;
