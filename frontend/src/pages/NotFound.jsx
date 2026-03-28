import React from "react";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen  from-black via-indigo-950 to-pink-900">
            <h1 className="text-5xl font-bold text-white mb-4">404 - Page Not Found</h1>
            <p className="text-lg text-gray-300 mb-8">The page you are looking for does not exist.</p>
            <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">Go Home</a>
        </div>
    );
}

export default NotFound;