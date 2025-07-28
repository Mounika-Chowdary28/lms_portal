// src/routes/router.tsx
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router"
import App from "../App"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"

// Role-based pages
import AdminDashboard from "../pages/dashboard/AdminDashboard"
import InstructorDashboard from "../pages/dashboard/instructor/InstructorDashboard"
import StudentDashboard from "../pages/dashboard/StudentDashboard"
import EditCourse from "../pages/dashboard/instructor/EditCourse"
import CreateCourse from "../pages/dashboard/instructor/CreateCourse"
import CourseLearning from "../pages/CourseLearning"

// ✅ Import ProtectedRoute
import ProtectedRoute from "./ProtectedRoute"

const rootRoute = createRootRoute({
  component: App,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
})

const adminRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/admin",
  component: () => (
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  ),
})

const instructorRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/instructor",
  component: () => (
    <ProtectedRoute role="instructor">
      <InstructorDashboard />
    </ProtectedRoute>
  ),
})

const studentRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/student",
  component: () => (
    <ProtectedRoute role="student">
      <StudentDashboard />
    </ProtectedRoute>
  ),
})

// Fix the route paths to be relative to root, not dashboard
const createCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/instructor/create-course",
  component: () => (
    <ProtectedRoute role="instructor">
      <CreateCourse />
    </ProtectedRoute>
  ),
})

const editCourseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/instructor/edit-course/$id",
  component: () => (
    <ProtectedRoute role="instructor">
      <EditCourse />
    </ProtectedRoute>
  ),
})

// Course learning route - using a simpler approach
const courseLearningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/course/$courseId",
  component: () => (
    <ProtectedRoute role="student">
      <CourseLearning />
    </ProtectedRoute>
  ),
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  dashboardRoute.addChildren([adminRoute, instructorRoute, studentRoute]),
  createCourseRoute,
  editCourseRoute,
  courseLearningRoute,
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
