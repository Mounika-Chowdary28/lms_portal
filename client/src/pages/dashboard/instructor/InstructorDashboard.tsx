"use client"

import { useCallback, useState, useEffect } from "react"
import axios from "../../../api/axios"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "../../../context/AuthContext"

interface Course {
  _id: string
  title: string
  description: string
  instructor: {
    _id: string
    name: string
    email: string
  }
  studentIds: string[]
  enrolledCount?: number
  duration?: string
  level?: string
  category?: string
  rating?: number
  price?: string
  syllabus?: string[]
}

const InstructorDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  const fetchCourses = async () => {
    try {
      console.log(`🧑‍🏫 Fetching courses for instructor: ${user?.name}`)
      const response = await axios.get("/instructor/courses")
      console.log("✅ Instructor courses response:", response.data)
      setCourses(response.data)
    } catch (error) {
      console.error("❌ Error fetching instructor courses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleCreate = useCallback(() => {
    navigate({ to: "/dashboard/instructor/create-course" })
  }, [navigate])

  const handleEdit = (course: Course) => {
    navigate({ to: "/dashboard/instructor/edit-course/$id", params: { id: course._id } })
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await axios.delete(`/courses/${id}`)
        if (response.status === 200) {
          setCourses(courses.filter((course) => course._id !== id))
          alert("Course deleted successfully!")
        }
      } catch (error: any) {
        console.error("Error deleting course:", error)
        alert("Failed to delete course. Please try again.")
      }
    }
  }

  const totalStudents = courses.reduce(
    (sum, course) => sum + (course.enrolledCount || course.studentIds?.length || 0),
    0,
  )
  const averageRating =
    courses.length > 0
      ? (courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length).toFixed(1)
      : "0.0"

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 min-h-screen p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading courses...</div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">🧑‍🏫 Instructor Dashboard</h3>
            <p className="text-teal-100">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:scale-105"
          >
            ➕ Create New Course
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 bg-opacity-20 rounded-full">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-teal-100">Total Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 bg-opacity-20 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-teal-100">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-teal-100">Avg Rating</p>
                <p className="text-2xl font-bold">{averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500 bg-opacity-20 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-teal-100">Revenue</p>
                <p className="text-2xl font-bold">$2.4K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center text-white mt-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
            <p className="text-teal-100 mb-6">Create your first course to get started!</p>
            <button
              onClick={handleCreate}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
            >
              ➕ Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-lg text-white transition-all duration-300 hover:scale-105 hover:bg-opacity-20 overflow-hidden"
              >
                {/* Course Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-2 line-clamp-2">📚 {course.title}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-500 bg-opacity-30 rounded-full text-xs font-medium">
                          {course.level || "Beginner"}
                        </span>
                        <span className="px-2 py-1 bg-purple-500 bg-opacity-30 rounded-full text-xs font-medium">
                          {course.category || "General"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-300">{course.price || "$99"}</div>
                      <div className="flex items-center text-sm">
                        <span className="mr-1">⭐</span>
                        <span>{course.rating || "4.5"}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-200 mb-4 line-clamp-2">{course.description}</p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
                      <div className="text-lg font-bold">👥</div>
                      <div className="text-sm text-gray-200">Students</div>
                      <div className="text-xl font-semibold">
                        {course.enrolledCount || course.studentIds?.length || 0}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
                      <div className="text-lg font-bold">⏱️</div>
                      <div className="text-sm text-gray-200">Duration</div>
                      <div className="text-xl font-semibold">{course.duration || "8 weeks"}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      📋 View Details
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => handleEdit(course)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => handleDelete(course._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Details Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedCourse.title}</h2>
                    <p className="text-gray-600">{selectedCourse.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Course Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">📊 Course Statistics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Enrolled Students:</span>
                          <span className="font-semibold">
                            {selectedCourse.enrolledCount || selectedCourse.studentIds?.length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-semibold">{selectedCourse.duration || "8 weeks"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Level:</span>
                          <span className="font-semibold">{selectedCourse.level || "Beginner"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-semibold">{selectedCourse.category || "General"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <span className="font-semibold">⭐ {selectedCourse.rating || "4.5"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold text-green-600">{selectedCourse.price || "$99"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">👨‍🏫 Instructor Info</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-semibold">{selectedCourse.instructor?.name || "Unknown"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-semibold">{selectedCourse.instructor?.email || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Syllabus */}
                {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Course Syllabus</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="space-y-2">
                        {selectedCourse.syllabus.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(selectedCourse)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    ✏️ Edit Course
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorDashboard
