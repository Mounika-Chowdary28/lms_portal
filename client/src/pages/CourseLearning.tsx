"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import axios from "../api/axios"
import { useAuth } from "../context/AuthContext"

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
  syllabus?: string[]
  prerequisites?: string[]
  learningOutcomes?: string[]
  totalLessons?: number
  estimatedHours?: number
  language?: string
  certificate?: boolean
}

interface CourseProgress {
  courseId: string
  userId: string
  completedLessons: number[]
  lastAccessed: string
  progressPercentage: number
}

const CourseLearning = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [savingProgress, setSavingProgress] = useState(false)

  // Extract course ID from URL
  const getCourseIdFromUrl = () => {
    const path = window.location.pathname
    const match = path.match(/\/course\/(.+)/)
    return match ? match[1] : null
  }

  const courseId = getCourseIdFromUrl()

  // Generate storage key for this user and course
  const getStorageKey = () => {
    return `course_progress_${user?.email}_${courseId}`
  }

  // Load progress from localStorage
  const loadProgressFromStorage = (): number[] => {
    try {
      const storageKey = getStorageKey()
      const savedProgress = localStorage.getItem(storageKey)
      if (savedProgress) {
        const progress: CourseProgress = JSON.parse(savedProgress)
        console.log("📚 Loaded progress from storage:", progress)
        return progress.completedLessons || []
      }
    } catch (error) {
      console.error("Error loading progress from storage:", error)
    }
    return []
  }

  // Save progress to localStorage
  const saveProgressToStorage = (completedLessons: number[]) => {
    try {
      if (!courseId || !user) return

      const progressData: CourseProgress = {
        courseId,
        userId: user.email,
        completedLessons,
        lastAccessed: new Date().toISOString(),
        progressPercentage: course?.syllabus?.length
          ? Math.round((completedLessons.length / course.syllabus.length) * 100)
          : 0,
      }

      const storageKey = getStorageKey()
      localStorage.setItem(storageKey, JSON.stringify(progressData))
      console.log("💾 Progress saved to storage:", progressData)
    } catch (error) {
      console.error("Error saving progress to storage:", error)
    }
  }

  // Save progress to backend (optional - for future implementation)
  const saveProgressToBackend = async (completedLessons: number[]) => {
    if (!courseId || !user) return

    try {
      setSavingProgress(true)
      const progressData = {
        courseId,
        completedLessons,
        progressPercentage: course?.syllabus?.length
          ? Math.round((completedLessons.length / course.syllabus.length) * 100)
          : 0,
      }

      // This endpoint would need to be implemented in the backend
      await axios.post(`/courses/${courseId}/progress`, progressData)
      console.log("☁️ Progress saved to backend")
    } catch (error) {
      console.error("Error saving progress to backend:", error)
      // Don't show error to user as localStorage backup exists
    } finally {
      setSavingProgress(false)
    }
  }

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError("Course ID not found")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log("Fetching course:", courseId)

        // Fetch course details
        const courseResponse = await axios.get(`/courses/${courseId}`)
        setCourse(courseResponse.data)

        // Check enrollment status
        const enrollmentResponse = await axios.get(`/courses/${courseId}/enrollment-status`)
        setIsEnrolled(enrollmentResponse.data.isEnrolled)

        if (!enrollmentResponse.data.isEnrolled) {
          setError("You are not enrolled in this course")
        } else {
          // Load saved progress after confirming enrollment
          const savedProgress = loadProgressFromStorage()
          setCompletedLessons(savedProgress)
          console.log("📖 Restored progress:", savedProgress)
        }
      } catch (error: any) {
        console.error("Error fetching course:", error)
        setError("Failed to load course")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCourse()
    }
  }, [courseId, user])

  const handleBackToDashboard = () => {
    navigate({ to: "/dashboard" })
  }

  const toggleLessonComplete = (lessonIndex: number) => {
    let newCompletedLessons: number[]

    if (completedLessons.includes(lessonIndex)) {
      newCompletedLessons = completedLessons.filter((i) => i !== lessonIndex)
    } else {
      newCompletedLessons = [...completedLessons, lessonIndex]
    }

    setCompletedLessons(newCompletedLessons)

    // Save progress immediately
    saveProgressToStorage(newCompletedLessons)

    // Also save to backend (optional)
    saveProgressToBackend(newCompletedLessons)

    // Show visual feedback
    const action = completedLessons.includes(lessonIndex) ? "unmarked" : "marked"
    console.log(`✅ Lesson ${lessonIndex + 1} ${action} as complete`)
  }

  const getProgressPercentage = () => {
    if (!course?.syllabus?.length) return 0
    return Math.round((completedLessons.length / course.syllabus.length) * 100)
  }

  // Clear progress (for testing/reset purposes)
  const clearProgress = () => {
    if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      setCompletedLessons([])
      saveProgressToStorage([])
      console.log("🔄 Progress reset")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-indigo-600 text-xl font-semibold">Loading course...</div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">{error || "Course not found"}</div>
          <button
            onClick={handleBackToDashboard}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">You are not enrolled in this course</div>
          <button
            onClick={handleBackToDashboard}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Progress: {getProgressPercentage()}% Complete
                {savingProgress && <span className="text-blue-500 ml-2">💾 Saving...</span>}
              </div>
              <button
                onClick={clearProgress}
                className="text-xs text-red-500 hover:text-red-700 underline"
                title="Reset Progress"
              >
                Reset Progress
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>👨‍🏫 {course.instructor.name}</span>
            <span>⏱️ {course.duration}</span>
            <span>📊 {course.level}</span>
            <span>🏷️ {course.category}</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {completedLessons.length} of {course.syllabus?.length || 0} lessons completed
              </span>
              <span className="text-sm font-medium text-indigo-600">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Progress Milestone */}
          {getProgressPercentage() === 100 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎉</span>
                <div>
                  <h3 className="text-green-800 font-semibold">Congratulations!</h3>
                  <p className="text-green-700 text-sm">You've completed all lessons in this course!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Course Syllabus</h2>

              {course.syllabus && course.syllabus.length > 0 ? (
                <div className="space-y-4">
                  {course.syllabus.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg transition-all duration-300 ${
                        completedLessons.includes(index)
                          ? "bg-green-50 border-green-200 shadow-sm"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleLessonComplete(index)}
                            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              completedLessons.includes(index)
                                ? "bg-green-500 border-green-500 text-white shadow-md transform scale-105"
                                : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                            }`}
                            title={completedLessons.includes(index) ? "Mark as incomplete" : "Mark as complete"}
                          >
                            {completedLessons.includes(index) && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>
                          <div className="flex-1">
                            <span
                              className={`font-medium ${
                                completedLessons.includes(index) ? "text-green-700 line-through" : "text-gray-700"
                              }`}
                            >
                              Lesson {index + 1}: {item}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              completedLessons.includes(index)
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {completedLessons.includes(index) ? "✅ Completed" : "⏳ Not Started"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">📝</div>
                  <p>Course syllabus will be available soon</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Course Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Lessons:</span>
                  <span className="font-semibold">{course.totalLessons || course.syllabus?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Hours:</span>
                  <span className="font-semibold">{course.estimatedHours || 40}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-semibold">{course.language || "English"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate:</span>
                  <span className="font-semibold">{course.certificate ? "✅ Yes" : "❌ No"}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Your Progress:</span>
                  <span className="font-semibold text-indigo-600">
                    {completedLessons.length}/{course.syllabus?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion:</span>
                  <span
                    className={`font-semibold ${getProgressPercentage() === 100 ? "text-green-600" : "text-indigo-600"}`}
                  >
                    {getProgressPercentage()}%
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Progress Stats</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{completedLessons.length}</div>
                  <div className="text-sm text-indigo-700">Lessons Completed</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{getProgressPercentage()}%</div>
                  <div className="text-sm text-green-700">Course Progress</div>
                </div>
                {getProgressPercentage() > 0 && (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {course.syllabus?.length ? course.syllabus.length - completedLessons.length : 0}
                    </div>
                    <div className="text-sm text-yellow-700">Lessons Remaining</div>
                  </div>
                )}
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Prerequisites</h3>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span className="text-gray-700 text-sm">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Learning Outcomes */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Learning Outcomes</h3>
                <ul className="space-y-2">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700 text-sm">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">👨‍🏫 Instructor</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-indigo-600">{course.instructor.name.charAt(0).toUpperCase()}</span>
                </div>
                <h4 className="font-semibold text-gray-800">{course.instructor.name}</h4>
                <p className="text-sm text-gray-600">{course.instructor.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseLearning
