import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";

type Course = { _id: string; title: string; instructor: { name: string } | string };

const RegisteredCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    axios.get("/student/courses/registered").then(res => setCourses(res.data));
  }, []);

  return (
    <div>
      <h2 className="font-semibold mb-2">Registered Courses</h2>
      <ul>
        {courses.map(c => (
          <li key={c._id}>
            {c.title} (Instructor: {typeof c.instructor === "object" && c.instructor !== null ? c.instructor.name : c.instructor})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisteredCourses;