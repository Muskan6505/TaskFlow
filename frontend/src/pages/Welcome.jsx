import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-8 shadow-2xl">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Welcome to TaskFlow
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
            Streamline your workflow with our powerful task management system.
            Organize, assign, and track tasks effortlessly.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-3xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Tasks</h3>
            <p className="text-gray-600 text-lg leading-relaxed">Easily create and assign tasks to team members with detailed descriptions and deadlines.</p>
          </div>

          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded-3xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Progress</h3>
            <p className="text-gray-600 text-lg leading-relaxed">Monitor task status and progress with real-time updates and comprehensive dashboards.</p>
          </div>

          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-100 to-pink-200 rounded-3xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="h-10 w-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Collaboration</h3>
            <p className="text-gray-600 text-lg leading-relaxed">Foster collaboration with role-based access and seamless communication tools.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link
              to="/login"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2"
            >
              🚀 Get Started
            </Link>
            <Link
              to="/signup"
              className="bg-white text-indigo-600 border-3 border-indigo-600 hover:bg-indigo-50 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:-translate-y-2 shadow-xl hover:shadow-2xl"
            >
              📝 Create Account
            </Link>
          </div>
          <p className="text-lg text-gray-500">
            Join thousands of teams already using TaskFlow to boost productivity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;