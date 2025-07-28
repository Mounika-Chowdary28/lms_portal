import express, { type Request, type Response } from "express"
import Course from "../models/course_model"
import type { UserDocument } from "../models/user_model"
import { protect, instructorOnly } from "../middleware/auth_middleware"
import type mongoose from "mongoose"

interface AuthenticatedRequest extends Request {
  user?: UserDocument
}

const router = express.Router()

// Sample fallback courses with syllabus
const fallbackCourses = [
  {
    _id: "sample1",
    title: "Introduction to React.js",
    description:
      "Learn the fundamentals of React.js including components, state management, and hooks. Perfect for beginners looking to start their frontend journey.",
    instructor: { _id: "inst1", name: "Dr. Sarah Johnson", email: "sarah@example.com" },
    studentIds: [],
    duration: "8 weeks",
    level: "Beginner",
    category: "Web Development",
    rating: 4.8,
    price: "$99",
    syllabus: [
      "Week 1: Introduction to React and JSX",
      "Week 2: Components and Props",
      "Week 3: State and Event Handling",
      "Week 4: React Hooks (useState, useEffect)",
      "Week 5: Forms and Controlled Components",
      "Week 6: React Router and Navigation",
      "Week 7: State Management with Context API",
      "Week 8: Final Project and Deployment",
    ],
  },
  {
    _id: "sample2",
    title: "Advanced Node.js & Express",
    description:
      "Master backend development with Node.js and Express. Build scalable APIs, handle authentication, and work with databases.",
    instructor: { _id: "inst2", name: "Prof. Michael Chen", email: "michael@example.com" },
    studentIds: [],
    duration: "10 weeks",
    level: "Advanced",
    category: "Backend Development",
    rating: 4.9,
    price: "$149",
    syllabus: [
      "Week 1: Advanced Node.js Concepts",
      "Week 2: Express.js Framework Deep Dive",
      "Week 3: Database Integration (MongoDB, PostgreSQL)",
      "Week 4: Authentication and Authorization",
      "Week 5: RESTful API Design",
      "Week 6: GraphQL Implementation",
      "Week 7: Testing and Error Handling",
      "Week 8: Performance Optimization",
      "Week 9: Deployment and DevOps",
      "Week 10: Microservices Architecture",
    ],
  },
  {
    _id: "sample3",
    title: "Python for Data Science",
    description:
      "Dive into data science with Python. Learn pandas, numpy, matplotlib, and machine learning basics with real-world projects.",
    instructor: { _id: "inst3", name: "Dr. Emily Rodriguez", email: "emily@example.com" },
    studentIds: [],
    duration: "12 weeks",
    level: "Intermediate",
    category: "Data Science",
    rating: 4.7,
    price: "$199",
    syllabus: [
      "Week 1: Python Fundamentals for Data Science",
      "Week 2: NumPy for Numerical Computing",
      "Week 3: Pandas for Data Manipulation",
      "Week 4: Data Visualization with Matplotlib",
      "Week 5: Advanced Visualization with Seaborn",
      "Week 6: Data Cleaning and Preprocessing",
      "Week 7: Statistical Analysis",
      "Week 8: Introduction to Machine Learning",
      "Week 9: Supervised Learning Algorithms",
      "Week 10: Unsupervised Learning",
      "Week 11: Model Evaluation and Selection",
      "Week 12: Final Data Science Project",
    ],
  },
  {
    _id: "sample4",
    title: "UI/UX Design Fundamentals",
    description:
      "Learn design principles, user research, wireframing, and prototyping. Create beautiful and functional user interfaces.",
    instructor: { _id: "inst4", name: "Alex Thompson", email: "alex@example.com" },
    studentIds: [],
    duration: "6 weeks",
    level: "Beginner",
    category: "Design",
    rating: 4.6,
    price: "$79",
    syllabus: [
      "Week 1: Design Thinking and User-Centered Design",
      "Week 2: User Research and Personas",
      "Week 3: Information Architecture and Wireframing",
      "Week 4: Visual Design Principles",
      "Week 5: Prototyping and User Testing",
      "Week 6: Design Systems and Handoff",
    ],
  },
  {
    _id: "sample5",
    title: "Machine Learning with TensorFlow",
    description:
      "Build and deploy machine learning models using TensorFlow. Cover neural networks, deep learning, and AI applications.",
    instructor: { _id: "inst5", name: "Dr. James Wilson", email: "james@example.com" },
    studentIds: [],
    duration: "14 weeks",
    level: "Advanced",
    category: "Machine Learning",
    rating: 4.9,
    price: "$299",
    syllabus: [
      "Week 1: Introduction to Machine Learning",
      "Week 2: TensorFlow Basics",
      "Week 3: Linear and Logistic Regression",
      "Week 4: Neural Networks Fundamentals",
      "Week 5: Deep Learning with Keras",
      "Week 6: Convolutional Neural Networks",
      "Week 7: Recurrent Neural Networks",
      "Week 8: Natural Language Processing",
      "Week 9: Computer Vision",
      "Week 10: Transfer Learning",
      "Week 11: Model Optimization",
      "Week 12: Deployment Strategies",
      "Week 13: MLOps and Production",
      "Week 14: Capstone Project",
    ],
  },
  {
    _id: "sample6",
    title: "Mobile App Development with Flutter",
    description:
      "Create cross-platform mobile apps with Flutter and Dart. Build beautiful, native-quality apps for iOS and Android.",
    instructor: { _id: "inst6", name: "Lisa Park", email: "lisa@example.com" },
    studentIds: [],
    duration: "10 weeks",
    level: "Intermediate",
    category: "Mobile Development",
    rating: 4.5,
    price: "$179",
    syllabus: [
      "Week 1: Dart Programming Language",
      "Week 2: Flutter Framework Basics",
      "Week 3: Widgets and Layouts",
      "Week 4: Navigation and Routing",
      "Week 5: State Management",
      "Week 6: Networking and APIs",
      "Week 7: Local Storage and Databases",
      "Week 8: Platform-Specific Features",
      "Week 9: Testing and Debugging",
      "Week 10: App Store Deployment",
    ],
  },
  {
    _id: "sample7",
    title: "DevOps and Cloud Computing",
    description:
      "Master DevOps practices with Docker, Kubernetes, AWS, and CI/CD pipelines. Deploy and scale applications in the cloud.",
    instructor: { _id: "inst7", name: "Robert Kim", email: "robert@example.com" },
    studentIds: [],
    duration: "12 weeks",
    level: "Advanced",
    category: "DevOps",
    rating: 4.8,
    price: "$249",
    syllabus: [
      "Week 1: DevOps Culture and Principles",
      "Week 2: Version Control with Git",
      "Week 3: Containerization with Docker",
      "Week 4: Container Orchestration with Kubernetes",
      "Week 5: CI/CD Pipeline Design",
      "Week 6: Infrastructure as Code",
      "Week 7: Cloud Platforms (AWS, Azure, GCP)",
      "Week 8: Monitoring and Logging",
      "Week 9: Security in DevOps",
      "Week 10: Performance Optimization",
      "Week 11: Disaster Recovery",
      "Week 12: Advanced DevOps Practices",
    ],
  },
  {
    _id: "sample8",
    title: "Cybersecurity Essentials",
    description:
      "Learn cybersecurity fundamentals, ethical hacking, network security, and how to protect digital assets.",
    instructor: { _id: "inst8", name: "Dr. Maria Garcia", email: "maria@example.com" },
    studentIds: [],
    duration: "8 weeks",
    level: "Intermediate",
    category: "Security",
    rating: 4.7,
    price: "$159",
    syllabus: [
      "Week 1: Cybersecurity Fundamentals",
      "Week 2: Network Security",
      "Week 3: Cryptography and Encryption",
      "Week 4: Web Application Security",
      "Week 5: Ethical Hacking and Penetration Testing",
      "Week 6: Incident Response",
      "Week 7: Security Compliance and Governance",
      "Week 8: Emerging Threats and Defense",
    ],
  },
  {
    _id: "sample9",
    title: "Blockchain Development",
    description:
      "Understand blockchain technology and build decentralized applications (DApps) using Solidity and Web3.",
    instructor: { _id: "inst9", name: "David Lee", email: "david@example.com" },
    studentIds: [],
    duration: "10 weeks",
    level: "Advanced",
    category: "Blockchain",
    rating: 4.6,
    price: "$199",
    syllabus: [
      "Week 1: Blockchain Fundamentals",
      "Week 2: Cryptocurrency and Bitcoin",
      "Week 3: Ethereum and Smart Contracts",
      "Week 4: Solidity Programming",
      "Week 5: DApp Development",
      "Week 6: Web3.js and Frontend Integration",
      "Week 7: Token Standards (ERC-20, ERC-721)",
      "Week 8: DeFi Protocols",
      "Week 9: Security Best Practices",
      "Week 10: Deployment and Testing",
    ],
  },
  {
    _id: "sample10",
    title: "Digital Marketing & Analytics",
    description:
      "Master digital marketing strategies, SEO, social media marketing, and data analytics to grow online presence.",
    instructor: { _id: "inst10", name: "Jennifer Brown", email: "jennifer@example.com" },
    studentIds: [],
    duration: "6 weeks",
    level: "Beginner",
    category: "Marketing",
    rating: 4.4,
    price: "$89",
    syllabus: [
      "Week 1: Digital Marketing Fundamentals",
      "Week 2: Search Engine Optimization (SEO)",
      "Week 3: Social Media Marketing",
      "Week 4: Content Marketing Strategy",
      "Week 5: Google Analytics and Data Analysis",
      "Week 6: Campaign Optimization and ROI",
    ],
  },
]

// In-memory storage for sample course enrollments (in production, use database)
const sampleEnrollments: { [courseId: string]: string[] } = {}

// In-memory storage for course progress (in production, use database)
const courseProgress: { [key: string]: { completedLessons: number[]; lastUpdated: Date } } = {}

// GET /api/courses - Get all published courses
router.get("/", async (req: Request, res: Response) => {
  console.log("📚 GET /api/courses - Request received")

  try {
    const { category, level, search, instructor } = req.query

    // Build filter object
    const filter: any = { status: "published" }

    if (category) filter.category = category
    if (level) filter.level = level
    if (instructor) filter.instructor = instructor

    // Build query
    let query = Course.find(filter)
      .populate("instructor", "name email")
      .populate("studentIds", "name email")
      .sort({ createdAt: -1 })

    // Add text search if provided
    if (search) {
      query = Course.find({
        ...filter,
        $text: { $search: search as string },
      })
        .populate("instructor", "name email")
        .populate("studentIds", "name email")
        .sort({ score: { $meta: "textScore" } })
    }

    const courses = await query.exec()

    console.log(`📊 Found ${courses.length} courses in database`)

    // Add computed fields
    const coursesWithStats = courses.map((course) => ({
      ...course.toObject(),
      enrolledCount: course.studentIds.length,
      isPopular: course.studentIds.length > 10,
      averageRating: course.rating,
    }))

    res.status(200).json(coursesWithStats)
  } catch (error: any) {
    console.error("❌ Error fetching courses:", error.message)
    res.status(500).json({
      message: "Error fetching courses",
      error: error.message,
    })
  }
})

// GET /api/courses/:id - Get single course with full details
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("studentIds", "name email")

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Add computed fields
    const courseWithStats = {
      ...course.toObject(),
      enrolledCount: course.studentIds.length,
      isPopular: course.studentIds.length > 10,
      averageRating: course.rating,
    }

    res.json(courseWithStats)
  } catch (error: any) {
    console.error("❌ Error fetching course:", error)
    res.status(500).json({ message: "Error fetching course", error: error.message })
  }
})

// POST /api/courses/:id/progress - Save course progress
router.post("/:id/progress", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId, completedLessons, progressPercentage } = req.body
    const userId = req.user!._id.toString()

    // Create a unique key for this user-course combination
    const progressKey = `${userId}_${courseId}`

    // Store progress (in production, save to database)
    courseProgress[progressKey] = {
      completedLessons: completedLessons || [],
      lastUpdated: new Date(),
    }

    console.log(`💾 Progress saved for user ${req.user!.name} in course ${courseId}:`, {
      completedLessons: completedLessons?.length || 0,
      progressPercentage,
    })

    res.json({
      message: "Progress saved successfully",
      progress: {
        completedLessons: completedLessons || [],
        progressPercentage: progressPercentage || 0,
        lastUpdated: new Date(),
      },
    })
  } catch (error: any) {
    console.error("❌ Error saving progress:", error)
    res.status(500).json({ message: "Error saving progress", error: error.message })
  }
})

// GET /api/courses/:id/progress - Get course progress
router.get("/:id/progress", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const courseId = req.params.id
    const userId = req.user!._id.toString()
    const progressKey = `${userId}_${courseId}`

    const progress = courseProgress[progressKey] || {
      completedLessons: [],
      lastUpdated: new Date(),
    }

    res.json({
      courseId,
      userId,
      completedLessons: progress.completedLessons,
      progressPercentage: 0, // Calculate based on course syllabus length
      lastUpdated: progress.lastUpdated,
    })
  } catch (error: any) {
    console.error("❌ Error fetching progress:", error)
    res.status(500).json({ message: "Error fetching progress", error: error.message })
  }
})

// GET /api/courses/categories/list - Get all unique categories
router.get("/categories/list", async (req: Request, res: Response) => {
  try {
    const categories = await Course.distinct("category", { status: "published" })
    res.json(categories.sort())
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching categories", error: error.message })
  }
})

// GET /api/courses/stats/overview - Get course statistics
router.get("/stats/overview", async (req: Request, res: Response) => {
  try {
    const totalCourses = await Course.countDocuments({ status: "published" })
    const totalStudents = await Course.aggregate([
      { $match: { status: "published" } },
      { $project: { studentCount: { $size: "$studentIds" } } },
      { $group: { _id: null, total: { $sum: "$studentCount" } } },
    ])

    const categoriesStats = await Course.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const levelStats = await Course.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$level", count: { $sum: 1 } } },
    ])

    res.json({
      totalCourses,
      totalStudents: totalStudents[0]?.total || 0,
      categoriesStats,
      levelStats,
    })
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching stats", error: error.message })
  }
})

// POST /api/courses - Create new course (Instructors only)
router.post("/", protect, instructorOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      description,
      duration,
      level,
      category,
      price,
      syllabus,
      prerequisites,
      learningOutcomes,
      totalLessons,
      estimatedHours,
      language,
      certificate,
      thumbnail,
      videoIntro,
    } = req.body

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description, and category are required",
      })
    }

    const course = await Course.create({
      title,
      description,
      instructor: req.user!._id,
      duration: duration || "8 weeks",
      level: level || "Beginner",
      category,
      price: price || "$99",
      syllabus: syllabus || [],
      prerequisites: prerequisites || [],
      learningOutcomes: learningOutcomes || [],
      totalLessons: totalLessons || 0,
      estimatedHours: estimatedHours || 40,
      language: language || "English",
      certificate: certificate !== undefined ? certificate : true,
      thumbnail,
      videoIntro,
      rating: 4.5,
      status: "published",
    })

    const populatedCourse = await Course.findById(course._id).populate("instructor", "name email")

    console.log(`✅ Course created: ${title} by ${req.user!.name}`)
    res.status(201).json(populatedCourse)
  } catch (error: any) {
    console.error("❌ Error creating course:", error)
    res.status(500).json({ message: "Error creating course", error: error.message })
  }
})

// PUT /api/courses/:id - Update course (Instructor only)
router.put("/:id", protect, instructorOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (course.instructor.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this course" })
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate("instructor", "name email")

    console.log(`✅ Course updated: ${updatedCourse?.title}`)
    res.json(updatedCourse)
  } catch (error: any) {
    console.error("❌ Error updating course:", error)
    res.status(500).json({ message: "Error updating course", error: error.message })
  }
})

// DELETE /api/courses/:id - Delete course (Instructor only)
router.delete("/:id", protect, instructorOnly, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (course.instructor.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this course" })
    }

    await Course.findByIdAndDelete(req.params.id)

    console.log(`✅ Course deleted: ${course.title}`)
    res.json({ message: "Course deleted successfully" })
  } catch (error: any) {
    console.error("❌ Error deleting course:", error)
    res.status(500).json({ message: "Error deleting course", error: error.message })
  }
})

// POST /api/courses/:id/enroll - Enroll in course
router.post("/:id/enroll", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (course.status !== "published") {
      return res.status(400).json({ message: "Course is not available for enrollment" })
    }

    const userId = req.user!._id as mongoose.Types.ObjectId

    // Check if already enrolled
    const isAlreadyEnrolled = course.studentIds.some((studentId) => studentId.toString() === userId.toString())

    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" })
    }

    // Add student to course
    course.studentIds.push(userId)
    await course.save()

    const updatedCourse = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("studentIds", "name email")

    console.log(`✅ Student enrolled: ${req.user!.name} in ${course.title}`)
    res.json({
      message: "Successfully enrolled in course",
      course: updatedCourse,
    })
  } catch (error: any) {
    console.error("❌ Enrollment error:", error)
    res.status(500).json({ message: "Error enrolling in course", error: error.message })
  }
})

// POST /api/courses/:id/unenroll - Unenroll from course
router.post("/:id/unenroll", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const userId = req.user!._id as mongoose.Types.ObjectId

    // Remove student from course
    course.studentIds = course.studentIds.filter((studentId) => studentId.toString() !== userId.toString())
    await course.save()

    // Also clear progress for this user-course combination
    const progressKey = `${userId.toString()}_${req.params.id}`
    delete courseProgress[progressKey]

    const updatedCourse = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("studentIds", "name email")

    console.log(`✅ Student unenrolled: ${req.user!.name} from ${course.title}`)
    res.json({
      message: "Successfully unenrolled from course",
      course: updatedCourse,
    })
  } catch (error: any) {
    res.status(500).json({ message: "Error unenrolling from course", error: error.message })
  }
})

// GET /api/courses/:id/enrollment-status - Check enrollment status
router.get("/:id/enrollment-status", protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const userId = req.user!._id as mongoose.Types.ObjectId
    const isEnrolled = course.studentIds.some((studentId) => studentId.toString() === userId.toString())

    res.json({
      isEnrolled,
      courseId: req.params.id,
      enrolledCount: course.studentIds.length,
    })
  } catch (error: any) {
    res.status(500).json({ message: "Error checking enrollment status", error: error.message })
  }
})

export default router
