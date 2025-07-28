"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "@tanstack/react-router"
import axios from "../../../api/axios"

interface CourseData {
  _id: string
  title: string
  description: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  price: string
  estimatedHours: number
  totalLessons: number
  language: string
  certificate: boolean
  syllabus: string[]
  prerequisites: string[]
  learningOutcomes: string[]
  studentIds: any[]
}

const EditCourse = () => {
  const { id } = useParams({ from: "/dashboard/instructor/edit-course/$id" })
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseData>()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<CourseData | null>(null)
  const [syllabus, setSyllabus] = useState<string[]>([""])
  const [prerequisites, setPrerequisites] = useState<string[]>([""])
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([""])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log("Fetching course with ID:", id)
        const response = await axios.get(`/courses/${id}`)
        const courseData = response.data

        console.log("Course data:", courseData)
        setCourse(courseData)

        // Reset form with course data
        reset({
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          level: courseData.level,
          duration: courseData.duration,
          price: courseData.price,
          estimatedHours: courseData.estimatedHours,
          totalLessons: courseData.totalLessons,
          language: courseData.language,
          certificate: courseData.certificate,
        })

        // Set dynamic arrays
        setSyllabus(courseData.syllabus?.length > 0 ? courseData.syllabus : [""])
        setPrerequisites(courseData.prerequisites?.length > 0 ? courseData.prerequisites : [""])
        setLearningOutcomes(courseData.learningOutcomes?.length > 0 ? courseData.learningOutcomes : [""])
      } catch (error) {
        console.error("Error fetching course:", error)
        alert("Failed to load course data")
        navigate({ to: "/dashboard" })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCourse()
    }
  }, [id, reset, navigate])

  const addArrayItem = (array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    setArray([...array, ""])
  }

  const removeArrayItem = (
    index: number,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (array.length > 1) {
      setArray(array.filter((_, i) => i !== index))
    }
  }

  const updateArrayItem = (
    index: number,
    value: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const newArray = [...array]
    newArray[index] = value
    setArray(newArray)
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const updateData = {
        ...data,
        syllabus: syllabus.filter((item) => item.trim() !== ""),
        prerequisites: prerequisites.filter((item) => item.trim() !== ""),
        learningOutcomes: learningOutcomes.filter((item) => item.trim() !== ""),
      }

      await axios.put(`/courses/${id}`, updateData)
      alert("Course updated successfully!")
      navigate({ to: "/dashboard" })
    } catch (error: any) {
      console.error("Error updating course:", error)
      alert(error.response?.data?.message || "Failed to update course")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: "/dashboard" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading course data...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Course not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">✏️ Edit Course</h2>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              disabled={isSubmitting}
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="mb-4 p-4 bg-blue-500 bg-opacity-20 rounded-lg">
            <p className="text-sm">
              <strong>Enrolled Students:</strong> {course.studentIds?.length || 0}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Course Title *</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Enter course title"
                  disabled={isSubmitting}
                />
                {errors.title && <p className="text-red-300 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <input
                  {...register("category", { required: "Category is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="e.g., Web Development"
                  disabled={isSubmitting}
                />
                {errors.category && <p className="text-red-300 text-sm mt-1">{errors.category.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Describe what students will learn in this course"
                disabled={isSubmitting}
              />
              {errors.description && <p className="text-red-300 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Level *</label>
                <select
                  {...register("level", { required: "Level is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  disabled={isSubmitting}
                >
                  <option value="Beginner" className="text-black">
                    Beginner
                  </option>
                  <option value="Intermediate" className="text-black">
                    Intermediate
                  </option>
                  <option value="Advanced" className="text-black">
                    Advanced
                  </option>
                </select>
                {errors.level && <p className="text-red-300 text-sm mt-1">{errors.level.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration *</label>
                <input
                  {...register("duration", { required: "Duration is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="e.g., 8 weeks"
                  disabled={isSubmitting}
                />
                {errors.duration && <p className="text-red-300 text-sm mt-1">{errors.duration.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price *</label>
                <input
                  {...register("price", { required: "Price is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="e.g., $99"
                  disabled={isSubmitting}
                />
                {errors.price && <p className="text-red-300 text-sm mt-1">{errors.price.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Hours *</label>
                <input
                  type="number"
                  {...register("estimatedHours", { required: "Estimated hours required", valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="40"
                  disabled={isSubmitting}
                />
                {errors.estimatedHours && <p className="text-red-300 text-sm mt-1">{errors.estimatedHours.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Total Lessons *</label>
                <input
                  type="number"
                  {...register("totalLessons", { required: "Total lessons required", valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="20"
                  disabled={isSubmitting}
                />
                {errors.totalLessons && <p className="text-red-300 text-sm mt-1">{errors.totalLessons.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Language *</label>
                <input
                  {...register("language", { required: "Language is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="English"
                  disabled={isSubmitting}
                />
                {errors.language && <p className="text-red-300 text-sm mt-1">{errors.language.message}</p>}
              </div>
            </div>

            {/* Certificate */}
            <div className="flex items-center">
              <input type="checkbox" {...register("certificate")} className="mr-3 h-4 w-4" disabled={isSubmitting} />
              <label className="text-sm font-medium">Provide certificate upon completion</label>
            </div>

            {/* Dynamic Arrays */}
            <div className="space-y-6">
              {/* Syllabus */}
              <div>
                <label className="block text-sm font-medium mb-2">Course Syllabus</label>
                {syllabus.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      value={item}
                      onChange={(e) => updateArrayItem(index, e.target.value, syllabus, setSyllabus)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder={`Week ${index + 1}: Topic`}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, syllabus, setSyllabus)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                      disabled={isSubmitting || syllabus.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(syllabus, setSyllabus)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm"
                  disabled={isSubmitting}
                >
                  + Add Syllabus Item
                </button>
              </div>

              {/* Prerequisites */}
              <div>
                <label className="block text-sm font-medium mb-2">Prerequisites</label>
                {prerequisites.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      value={item}
                      onChange={(e) => updateArrayItem(index, e.target.value, prerequisites, setPrerequisites)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Required knowledge or skill"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, prerequisites, setPrerequisites)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                      disabled={isSubmitting || prerequisites.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(prerequisites, setPrerequisites)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm"
                  disabled={isSubmitting}
                >
                  + Add Prerequisite
                </button>
              </div>

              {/* Learning Outcomes */}
              <div>
                <label className="block text-sm font-medium mb-2">Learning Outcomes</label>
                {learningOutcomes.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      value={item}
                      onChange={(e) => updateArrayItem(index, e.target.value, learningOutcomes, setLearningOutcomes)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="What students will be able to do"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, learningOutcomes, setLearningOutcomes)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                      disabled={isSubmitting || learningOutcomes.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(learningOutcomes, setLearningOutcomes)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm"
                  disabled={isSubmitting}
                >
                  + Add Learning Outcome
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "🔄 Updating Course..." : "✅ Update Course"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCourse
