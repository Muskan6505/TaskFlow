import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const { user, isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/users/logout', {}, { withCredentials: true });
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl fixed top-0 w-full z-50 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white text-2xl font-bold hover:text-gray-100 transition-all duration-300 transform hover:scale-105">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-white hover:bg-white/20 hover:backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-white hover:bg-white/20 hover:backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <div className="w-9 h-9 bg-gradient-to-r from-white/30 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block">{user?.name}</span>
                    <svg className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-white/20">
                    <div className="px-4 py-3 border-b border-gray-200/50 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 capitalize">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-b-2xl"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:bg-white/20 hover:backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-indigo-600 hover:bg-gray-50 hover:text-indigo-700 px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-white/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;