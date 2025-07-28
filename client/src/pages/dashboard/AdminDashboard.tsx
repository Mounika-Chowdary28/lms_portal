import { useEffect, useState } from 'react';
import axios from 'api/axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      console.log('=== ADMIN DASHBOARD DEBUG ===');
      console.log('Fetching users from database...');
      console.log('API URL:', 'http://localhost:5000/api/auth/test-users');
      
      // Use test endpoint to get all users without authentication
      const response = await axios.get('/auth/test-users');
      console.log('✅ API call successful!');
      console.log('Response status:', response.status);
      console.log('Users from database:', response.data);
      console.log('Number of users:', response.data.length);
      setUsers(response.data);
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Note: You'll need to add a DELETE /auth/users/:id route in the backend
        // await axios.delete(`/auth/users/${userId}`);
        // For now, just remove from local state
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 min-h-screen p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 min-h-screen p-6">
      <h3 className="text-2xl font-bold mb-6 text-white">🧑‍💼 User Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl overflow-hidden text-white shadow-lg">
          <thead>
            <tr className="bg-white bg-opacity-20 text-white">
              <th className="p-4 text-left">👤 Name</th>
              <th className="p-4 text-left">📧 Email</th>
              <th className="p-4 text-left">🎓 Role</th>
              <th className="p-4 text-left">⚙ Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user._id}
                className={`transition hover:bg-white hover:bg-opacity-10 ${
                  idx % 2 === 0 ? 'bg-white bg-opacity-5' : ''
                }`}
              >
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 capitalize">{user.role}</td>
                <td className="p-4">
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm transition"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="text-center text-white mt-8">
          <p className="text-xl">No users found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
