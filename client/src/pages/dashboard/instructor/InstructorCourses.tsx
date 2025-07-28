import { useEffect, useState } from "react";
import axios from "api/axios";
import { useNavigate } from "react-router-dom";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    const res = await axios.get("/instructor/courses");
    setCourses(res.data);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await axios.delete(`/courses/${id}`);
        if (response.status === 200) {
          // Remove the course from local state immediately
          setCourses(courses.filter((course: any) => course._id !== id));
          alert("Course deleted successfully!");
        }
      } catch (error: any) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  const handleEdit = (id: string) => {
    // Navigate to edit page (to be implemented)
    navigate(`/dashboard/instructor/edit-course/${id}`);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h2>My Courses</h2>
      <ul>
        {courses.map((c: any) => (
          <li key={c._id}>
            {c.title}
            <button onClick={() => handleEdit(c._id)}>Edit</button>
            <button onClick={() => handleDelete(c._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructorCourses;
