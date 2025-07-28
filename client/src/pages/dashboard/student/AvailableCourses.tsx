import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";

type Course = { _id: string; title: string; instructor: { name: string } | string };

const AvailableCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    axios.get("/student/courses/available").then(res => setCourses(res.data));
  }, []);

  const enroll = (id: string) => {
    axios.post(`/student/courses/${id}/enroll`).then(() => {
      setCourses(courses.filter(c => c._id !== id));
      alert("Enrolled!");
    });
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">Available Courses</h2>
      <ul>
        {courses.map(c => (
          <li key={c._id} className="mb-2">
            <span>
              {c.title} (Instructor: {typeof c.instructor === "object" && c.instructor !== null ? c.instructor.name : c.instructor})
            </span>
            <button onClick={() => enroll(c._id)} className="ml-2 btn btn-sm">Enroll</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableCourses;