import mongoose from "mongoose"
import bcryptjs from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

// Define interfaces for better type safety
interface IUser {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  role: string
}

interface ICourse {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  instructor: mongoose.Types.ObjectId | IUser
  studentIds: mongoose.Types.ObjectId[]
  duration: string
  level: string
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
  status: string
  thumbnail?: string
  videoIntro?: string
}

// Define schemas (simplified for seeding)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
})

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    duration: String,
    level: String,
    category: String,
    rating: Number,
    price: String,
    syllabus: [String],
    prerequisites: [String],
    learningOutcomes: [String],
    totalLessons: Number,
    estimatedHours: Number,
    language: String,
    certificate: Boolean,
    status: String,
    thumbnail: String,
    videoIntro: String,
  },
  { timestamps: true },
)

const User = mongoose.model<IUser>("User", userSchema)
const Course = mongoose.model<ICourse>("Course", courseSchema)

const sampleCourses = [
  {
    title: "Introduction to React.js",
    description:
      "Learn the fundamentals of React.js including components, state management, and hooks. Perfect for beginners looking to start their frontend journey.",
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
    prerequisites: ["Basic HTML, CSS, and JavaScript knowledge", "Familiarity with ES6+ syntax"],
    learningOutcomes: [
      "Build interactive React applications",
      "Understand component lifecycle and hooks",
      "Implement state management solutions",
      "Create responsive user interfaces",
    ],
    totalLessons: 32,
    estimatedHours: 40,
    language: "English",
    certificate: true,
    status: "published",
  },
  {
    title: "Advanced Node.js & Express",
    description:
      "Master backend development with Node.js and Express. Build scalable APIs, handle authentication, and work with databases.",
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
    prerequisites: ["Solid JavaScript knowledge", "Basic Node.js experience", "Understanding of HTTP protocols"],
    learningOutcomes: [
      "Build scalable backend applications",
      "Implement secure authentication systems",
      "Design and develop RESTful APIs",
      "Deploy applications to production",
    ],
    totalLessons: 45,
    estimatedHours: 60,
    language: "English",
    certificate: true,
    status: "published",
  },
  {
    title: "Python for Data Science",
    description:
      "Dive into data science with Python. Learn pandas, numpy, matplotlib, and machine learning basics with real-world projects.",
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
    prerequisites: ["Basic Python programming", "High school mathematics", "Statistics fundamentals"],
    learningOutcomes: [
      "Analyze and visualize complex datasets",
      "Build predictive machine learning models",
      "Clean and preprocess real-world data",
      "Present data insights effectively",
    ],
    totalLessons: 48,
    estimatedHours: 80,
    language: "English",
    certificate: true,
    status: "published",
  },
  {
    title: "UI/UX Design Fundamentals",
    description:
      "Learn design principles, user research, wireframing, and prototyping. Create beautiful and functional user interfaces.",
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
    prerequisites: ["No prior design experience required", "Basic computer skills"],
    learningOutcomes: [
      "Apply design thinking methodology",
      "Create user-centered design solutions",
      "Build interactive prototypes",
      "Conduct user research and testing",
    ],
    totalLessons: 24,
    estimatedHours: 30,
    language: "English",
    certificate: true,
    status: "published",
  },
  {
    title: "Machine Learning with TensorFlow",
    description:
      "Build and deploy machine learning models using TensorFlow. Cover neural networks, deep learning, and AI applications.",
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
    prerequisites: ["Python programming", "Linear algebra", "Statistics", "Calculus basics"],
    learningOutcomes: [
      "Build deep learning models with TensorFlow",
      "Implement computer vision solutions",
      "Deploy ML models to production",
      "Optimize model performance",
    ],
    totalLessons: 56,
    estimatedHours: 100,
    language: "English",
    certificate: true,
    status: "published",
  },
  {
    title: "Mobile App Development with Flutter",
    description:
      "Create cross-platform mobile apps with Flutter and Dart. Build beautiful, native-quality apps for iOS and Android.",
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
    prerequisites: ["Basic programming knowledge", "Object-oriented programming concepts"],
    learningOutcomes: [
      "Develop cross-platform mobile applications",
      "Implement complex UI designs",
      "Integrate with backend services",
      "Publish apps to app stores",
    ],
    totalLessons: 40,
    estimatedHours: 70,
    language: "English",
    certificate: true,
    status: "published",
  },
  {
    title: "DevOps and Cloud Computing",
    description:
      "Master DevOps practices with Docker, Kubernetes, AWS, and CI/CD pipelines. Deploy and scale applications in the cloud.",
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
    prerequisites: ["Linux command line", "Basic networking", "Software development experience"],
    learningOutcomes: [
      "Implement CI/CD pipelines",
      "Deploy applications to cloud platforms",
      "Manage containerized applications",
      "Monitor and optimize system performance",
    ],
    totalLessons: 48,
    estimatedHours: 90,
    language: "English",
    certificate: true,
    status: "published",
  },
  {
    title: "Cybersecurity Essentials",
    description:
      "Learn cybersecurity fundamentals, ethical hacking, network security, and how to protect digital assets.",
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
    prerequisites: ["Basic networking knowledge", "Understanding of operating systems"],
    learningOutcomes: [
      "Identify and mitigate security threats",
      "Implement security best practices",
      "Conduct security assessments",
      "Respond to security incidents",
    ],
    totalLessons: 32,
    estimatedHours: 50,
    language: "English",
    certificate: true,
    status: "published",
  },
  {
    title: "Blockchain Development",
    description:
      "Understand blockchain technology and build decentralized applications (DApps) using Solidity and Web3.",
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
    prerequisites: ["JavaScript programming", "Basic cryptography", "Web development basics"],
    learningOutcomes: [
      "Develop smart contracts with Solidity",
      "Build decentralized applications",
      "Understand blockchain architecture",
      "Implement DeFi solutions",
    ],
    totalLessons: 40,
    estimatedHours: 75,
    language: "English",
    certificate: true,
    status: "published",
  },
  {
    title: "Digital Marketing & Analytics",
    description:
      "Master digital marketing strategies, SEO, social media marketing, and data analytics to grow online presence.",
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
    prerequisites: ["Basic computer skills", "Understanding of social media platforms"],
    learningOutcomes: [
      "Create effective digital marketing campaigns",
      "Optimize websites for search engines",
      "Analyze marketing performance data",
      "Develop content marketing strategies",
    ],
    totalLessons: 24,
    estimatedHours: 35,
    language: "English",
    certificate: true,
    status: "published",
  },
]

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGO_URI!)
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    console.log("Clearing existing courses...")
    await Course.deleteMany({})
    console.log("✅ Cleared existing courses")

    // Create sample instructors
    const instructors = [
      { name: "Dr. Sarah Johnson", email: "sarah@example.com", password: "password123", role: "instructor" },
      { name: "Prof. Michael Chen", email: "michael@example.com", password: "password123", role: "instructor" },
      { name: "Dr. Emily Rodriguez", email: "emily@example.com", password: "password123", role: "instructor" },
      { name: "Alex Thompson", email: "alex@example.com", password: "password123", role: "instructor" },
      { name: "Dr. James Wilson", email: "james@example.com", password: "password123", role: "instructor" },
      { name: "Lisa Park", email: "lisa@example.com", password: "password123", role: "instructor" },
      { name: "Robert Kim", email: "robert@example.com", password: "password123", role: "instructor" },
      { name: "Dr. Maria Garcia", email: "maria@example.com", password: "password123", role: "instructor" },
      { name: "David Lee", email: "david@example.com", password: "password123", role: "instructor" },
      { name: "Jennifer Brown", email: "jennifer@example.com", password: "password123", role: "instructor" },
    ]

    // Hash passwords and create instructors
    const createdInstructors: IUser[] = []
    for (const instructor of instructors) {
      let existingUser = await User.findOne({ email: instructor.email })
      if (!existingUser) {
        const hashedPassword = await bcryptjs.hash(instructor.password, 10)
        existingUser = await User.create({
          ...instructor,
          password: hashedPassword,
        })
        console.log(`✅ Created instructor: ${instructor.name}`)
      } else {
        console.log(`ℹ️  Instructor already exists: ${instructor.name}`)
      }
      createdInstructors.push(existingUser)
    }

    // Create courses with full details
    console.log("Creating courses with detailed information...")
    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = sampleCourses[i]
      const instructor = createdInstructors[i % createdInstructors.length]

      const newCourse = await Course.create({
        ...courseData,
        instructor: instructor._id,
        studentIds: [],
      })
      console.log(`✅ Created course: ${courseData.title}`)
    }

    console.log("\n🎉 Database seeded successfully!")
    console.log(`📚 Created ${sampleCourses.length} courses with detailed information`)
    console.log(`👨‍🏫 Created/Used ${createdInstructors.length} instructors`)

    // Verify courses were created
    const courseCount = await Course.countDocuments()
    console.log(`📊 Total courses in database: ${courseCount}`)

    // Show sample course details with proper typing
    const sampleCourse = (await Course.findOne().populate("instructor", "name email")) as
      | (ICourse & {
          instructor: IUser
        })
      | null

    console.log("\n📋 Sample course details:")
    console.log(`Title: ${sampleCourse?.title || "N/A"}`)
    console.log(`Instructor: ${sampleCourse?.instructor?.name || "N/A"}`)
    console.log(`Syllabus items: ${sampleCourse?.syllabus?.length || 0}`)
    console.log(`Prerequisites: ${sampleCourse?.prerequisites?.length || 0}`)
    console.log(`Learning outcomes: ${sampleCourse?.learningOutcomes?.length || 0}`)

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
