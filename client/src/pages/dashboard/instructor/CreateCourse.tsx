"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "../../../api/axios"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

const schema = yup.object().shape({
  title: yup.string().required("Title is required").max(200, "Title too long"),
  description: yup.string().required("Description is required").max(2000, "Description too long"),
  category: yup.string().required("Category is required"),
  level: yup.string().oneOf(["Beginner", "Intermediate", "Advanced"]).required("Level is required"),
  duration: yup.string().required("Duration is required"),
  price: yup.string().required("Price is required"),
  estimatedHours: yup.number().positive("Must be positive").required("Estimated hours required"),
  totalLessons: yup.number().positive("Must be positive").required("Total lessons required"),
  language: yup.string().required("Language is required"),
  certificate: yup.boolean().default(true),
})

interface FormData {
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
}

const CreateCourse = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [syllabus, setSyllabus] = useState<string[]>([""])
  const [prerequisites, setPrerequisites] = useState<string[]>([""])
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([""])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      level: "Beginner",
      duration: "8 weeks",
      price: "$99",
      estimatedHours: 40,
      totalLessons: 20,
      language: "English",
      certificate: true,
    },
  })

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

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const courseData = {
        ...data,
        syllabus: syllabus.filter((item) => item.trim() !== ""),
        prerequisites: prerequisites.filter((item) => item.trim() !== ""),
        learningOutcomes: learningOutcomes.filter((item) => item.trim() !== ""),
      }

      const response = await axios.post("/courses", courseData)
      console.log("✅ Course created:", response.data)

      alert("Course created successfully!")
      navigate({ to: "/dashboard" })
    } catch (error: any) {
      console.error("❌ Error creating course:", error)
      alert(error.response?.data?.message || "Failed to create course")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: "/dashboard" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">📚 Create New Course</h2>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              disabled={isLoading}
            >
              ← Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Course Title *</label>
                <input
                  {...register("title")}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Enter course title"
                  disabled={isLoading}
                />
                {errors.title && <p className="text-red-300 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <input
                  {...register("category")}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="e.g., Web Development"
                  disabled={isLoading}
                />
                {errors.category && <p className="text-red-300 text-sm mt-1">{errors.category.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Describe what students will learn in this course"
                disabled={isLoading}
              />
              {errors.description && <p className="text-red-300 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Level *</label>
                <select
                  {...register("level")}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  disabled={isLoading}
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
                  {...register("duration")}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="e.g., 8 weeks"
                  disabled={isLoading}
                />
                {errors.duration && <p className="text-red-300 text-sm mt-1">{errors.duration.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price *</label>
                <input
                  {...register("price")}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="e.g., $99"
                  disabled={isLoading}
                />
                {errors.price && <p className="text-red-300 text-sm mt-1">{errors.price.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Hours *</label>
                <input
                  type="number"
                  {...register("estimatedHours", { valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="40"
                  disabled={isLoading}
                />
                {errors.estimatedHours && <p className="text-red-300 text-sm mt-1">{errors.estimatedHours.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Total Lessons *</label>
                <input
                  type="number"
                  {...register("totalLessons", { valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="20"
                  disabled={isLoading}
                />
                {errors.totalLessons && <p className="text-red-300 text-sm mt-1">{errors.totalLessons.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Language *</label>
                <input
                  {...register("language")}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="English"
                  disabled={isLoading}
                />
                {errors.language && <p className="text-red-300 text-sm mt-1">{errors.language.message}</p>}
              </div>
            </div>

            {/* Certificate */}
            <div className="flex items-center">
              <input type="checkbox" {...register("certificate")} className="mr-3 h-4 w-4" disabled={isLoading} />
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
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, syllabus, setSyllabus)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                      disabled={isLoading || syllabus.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(syllabus, setSyllabus)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm"
                  disabled={isLoading}
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
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, prerequisites, setPrerequisites)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                      disabled={isLoading || prerequisites.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(prerequisites, setPrerequisites)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm"
                  disabled={isLoading}
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
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, learningOutcomes, setLearningOutcomes)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                      disabled={isLoading || learningOutcomes.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(learningOutcomes, setLearningOutcomes)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm"
                  disabled={isLoading}
                >
                  + Add Learning Outcome
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "🔄 Creating Course..." : "✅ Create Course"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors"
                disabled={isLoading}
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

export default CreateCourse
