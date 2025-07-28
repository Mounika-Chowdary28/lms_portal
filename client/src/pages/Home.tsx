import { Link } from '@tanstack/react-router';

const Home = () => {
  return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-800 via-teal-600 to-teal-500 px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-10 max-w-xl w-full text-white text-center">
        <h1 className="text-4xl font-extrabold mb-4">🎓 LMS Platform</h1>
        <p className="text-lg text-gray-200 mb-8">
          Welcome to the Learning Management System. <br />
          Register or login to access your personalized dashboard based on your role.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-40 border border-white border-opacity-30 text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:scale-105"
          >
            🔐 Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-40 border border-white border-opacity-30 text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:scale-105"
          >
            📝 Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;