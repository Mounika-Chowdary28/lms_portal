"use client"

import { useEffect, useState } from "react"
import axios from "../../api/axios"
import { useAuth } from "../../context/AuthContext"

interface Course {
  _id: string
  title: string
  description: string
  instructor: {
    _id: string
    name: string
    email: string
  }
  studentIds: any[]
  duration?: string
  level?: string
  category?: string
  rating?: number
  price?: string
  createdAt?: string
  updatedAt?: string
}

const StudentDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "enrolled" | "available">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [enrollmentStatus, setEnrollmentStatus] = useState<{ [courseId: string]: boolean }>({})
  const { user } = useAuth()

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 Fetching courses from API...")

      const response = await axios.get("/courses")
      console.log("✅ API Response:", response.data)
      console.log("📊 Number of courses:", response.data.length)

      setCourses(response.data)

      // Check enrollment status for each course
      const statusPromises = response.data.map(async (course: Course) => {
        try {
          const statusResponse = await axios.get(`/courses/${course._id}/enrollment-status`)
          return { courseId: course._id, isEnrolled: statusResponse.data.isEnrolled }
        } catch (error) {
          console.error(`Error checking enrollment for ${course._id}:`, error)
          return { courseId: course._id, isEnrolled: false }
        }
      })

      const statuses = await Promise.all(statusPromises)
      const statusMap = statuses.reduce(
        (acc, status) => {
          acc[status.courseId] = status.isEnrolled
          return acc
        },
        {} as { [courseId: string]: boolean },
      )

      setEnrollmentStatus(statusMap)

      if (response.data.length === 0) {
        console.log("⚠️ No courses found")
        setError("No courses available")
      }
    } catch (error: any) {
      console.error("❌ Error fetching courses:", error)
      console.error("Error details:", error.response?.data)
      setError(`Failed to fetch courses: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleEnroll = async (courseId: string) => {
    try {
      console.log(`🎯 Enrolling in course: ${courseId}`)
      const response = await axios.post(`/courses/${courseId}/enroll`)
      console.log("✅ Enrollment successful:", response.data)

      // Update enrollment status
      setEnrollmentStatus((prev) => ({
        ...prev,
        [courseId]: true,
      }))

      alert("Successfully enrolled in the course!")
      await fetchCourses() // Refresh courses to update counts
    } catch (error: any) {
      console.error("❌ Error enrolling:", error)
      alert(error.response?.data?.message || "Failed to enroll in course")
    }
  }

  const handleUnenroll = async (courseId: string) => {
    try {
      console.log(`🎯 Unenrolling from course: ${courseId}`)
      const response = await axios.post(`/courses/${courseId}/unenroll`)
      console.log("✅ Unenrollment successful:", response.data)

      // Update enrollment status
      setEnrollmentStatus((prev) => ({
        ...prev,
        [courseId]: false,
      }))

      alert("Successfully unenrolled from the course!")
      await fetchCourses() // Refresh courses to update counts
    } catch (error: any) {
      console.error("❌ Error unenrolling:", error)
      alert(error.response?.data?.message || "Failed to unenroll from course")
    }
  }

  const handleContinueLearning = (courseId: string) => {
    // Navigate to course learning page using window.location
    window.location.href = `/course/${courseId}`
  }

  const isEnrolled = (course: Course) => {
    return enrollmentStatus[course._id] || false
  }

  const isSampleCourse = (courseId: string) => {
    return courseId.startsWith("sample")
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "enrolled") return isEnrolled(course) && matchesSearch
    if (filter === "available") return !isEnrolled(course) && matchesSearch
    return matchesSearch
  })

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}>
            ⭐
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-indigo-600 text-xl font-semibold">Loading courses...</div>
      </div>
    )
  }

  const enrolledCourses = courses.filter((course) => isEnrolled(course))
  const availableCourses = courses.filter((course) => !isEnrolled(course))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Student Dashboard</h1>
          <p className="text-gray-600 text-lg">Discover and enroll in amazing courses to advance your skills</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📖</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableCourses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Courses ({courses.length})
              </button>
              <button
                onClick={() => setFilter("enrolled")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  filter === "enrolled" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                My Courses ({enrolledCourses.length})
              </button>
              <button
                onClick={() => setFilter("available")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  filter === "available" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Available ({availableCourses.length})
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${
                  isSampleCourse(course._id) ? "border-yellow-200" : "border-gray-100"
                }`}
              >
                {/* Course Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{course.title}</h3>
                        {isSampleCourse(course._id) && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Sample
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                          {course.level || "Beginner"}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {course.category || "General"}
                        </span>
                      </div>
                    </div>
                    {isEnrolled(course) && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        ✅ Enrolled
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                  {/* Course Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">👨‍🏫</span>
                      <span>{course.instructor?.name || "Unknown Instructor"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">⏱️</span>
                      <span>{course.duration || "8 weeks"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">👥</span>
                      <span>{course.studentIds?.length || 0} students enrolled</span>
                    </div>
                    {renderStars(course.rating)}
                  </div>
                </div>

                {/* Course Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-indigo-600">{course.price || "$99"}</div>
                    {isEnrolled(course) ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleContinueLearning(course._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Continue Learning
                        </button>
                        <button
                          onClick={() => handleUnenroll(course._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Unenroll
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
