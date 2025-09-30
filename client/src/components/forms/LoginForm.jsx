import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import authService from '../../services/authService';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const data = await authService.login(formData);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Login berhasil! Redirecting...");
      setTimeout(() => window.location.href = "/", 1500);
    } catch (err) {
      console.error(err);
      setMessage("Login gagal. Periksa email & password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-400 via-pink-400 to-purple-600">
      <div className="relative z-10 bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700/50">
        <h1 className="text-4xl font-bold text-center text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-8">Login</h1>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-4 bg-white/90 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full py-4 font-semibold rounded-xl text-white shadow-lg transform hover:scale-105 transition-all duration-300 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
            }`}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          {message && (
            <p className="text-center text-sm mt-2 text-red-400">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
