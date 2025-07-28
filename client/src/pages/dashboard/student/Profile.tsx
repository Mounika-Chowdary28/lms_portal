import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    axios.get("/student/profile").then(res => setProfile(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const save = () => {
    axios.put("/student/profile", profile).then(res => {
      setProfile(res.data);
      setEdit(false);
    });
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">Profile</h2>
      {edit ? (
        <div>
          <input name="name" value={profile.name} onChange={handleChange} className="input" />
          <input name="email" value={profile.email} onChange={handleChange} className="input" />
          <button onClick={save} className="btn btn-sm">Save</button>
        </div>
      ) : (
        <div>
          <div>Name: {profile.name}</div>
          <div>Email: {profile.email}</div>
          <button onClick={() => setEdit(true)} className="btn btn-sm">Edit</button>
        </div>
      )}
    </div>
  );
};

export default Profile;