import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import {
  Welcome,
  NotFound,
  Login,
  Signup,
  Dashboard
} from './pages';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import AuthenticatedLayout from './layout/Authenticated.jsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from './features/userSlice.js';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await axios.post('/api/v1/users/refresh', {}, { withCredentials: true });
        if (res.status === 200 && res.data?.data) {
          dispatch(login(res.data.data));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    refreshToken();
  }, [dispatch]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-indigo-600 text-xl font-semibold">Loading TaskFlow...</p>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Navbar />
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
