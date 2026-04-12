"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001'

export default function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // ✅ THÊM LOADING STATE

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true); // ✅ Bắt đầu loading
    try {
      const data = await authService.login(formData);
      authService.saveToken(data.accessToken, data.refreshToken, formData.rememberMe)
      navigate('/home');
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false); // ✅ Kết thúc loading
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
      <p className="text-gray-600 text-sm mb-6">
        Enter your information to sign in to your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email / Phone */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email or Phone Number
          </label>
          <input
            type="text"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder="Enter email or phone number"
            className={`w-full px-4 py-2 bg-white text-black border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all
              ${errors.emailOrPhone ? "border-red-500" : "border-cyan-500"}`}
          />
          {errors.emailOrPhone && (
            <p className="text-red-500 text-xs mt-1">{errors.emailOrPhone}</p>
          )}
        </div>

        {/* Password */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={`w-full px-4 py-2 bg-white text-black border rounded-lg pr-10
                focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all
                ${errors.password ? "border-red-500" : "border-cyan-500"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Remember Me + Forgot Password */}
        <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 bg-white accent-cyan-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700">Remember me</span>
          </label>
          <a href="/forgot" className="text-sm text-cyan-500 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* ✅ Hiển thị lỗi từ server */}
        {errors.general && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
            {errors.general}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          {isLoading ? "Signing in..." : "Sign In"} {/* ✅ Loading text */}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* SSO Buttons */}
        <div className="space-y-3">
          {/* Google */}
          <a href={`${BACKEND_URL}/api/auth/google`} type="button" className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 hover:border-cyan-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </a>
        </div>

      </form>
    </div>
  );
}