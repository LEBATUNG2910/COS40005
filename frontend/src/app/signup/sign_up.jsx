"use client"

import { useState } from "react"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import { authService } from "../../services/authService" // ✅ THÊM IMPORT NÀY

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    agreeToTerms: false,
    receiveNewsletter: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // ✅ THÊM LOADING STATE

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"

    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true) // ✅ Bắt đầu loading
    try {
      const data = await authService.register(formData)
      authService.saveToken(data.accessToken, false)
      setShowSuccessModal(true)
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setIsLoading(false) // ✅ Kết thúc loading
    }
  }

  const handleGoToLogin = () => window.location.reload()

  const inputBase =
    "text-black w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-8 animate-slide-up relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Up</h2>
        <p className="text-gray-600 text-sm mb-6">
          Create a new account to use Lang Chats services
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className={`text-black ${inputBase} ${
                errors.fullName ? "border-red-500" : "border-cyan-500"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`text-black ${inputBase} ${
                errors.phoneNumber ? "border-red-500" : "border-cyan-500"
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`text-black ${inputBase} ${
                errors.email ? "border-red-500" : "border-cyan-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`text-black ${inputBase} pr-10 ${
                  errors.password ? "border-red-500" : "border-cyan-500"
                }`}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={`text-black ${inputBase} pr-10 ${
                  errors.confirmPassword ? "border-red-500" : "border-cyan-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gender
            </label>
            <div className="flex gap-6">
              {["male", "female", "other"].map((gender) => (
                <label key={gender} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleChange}
                    className="w-4 h-4 bg-white accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {gender}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 bg-white accent-cyan-500 cursor-pointer"
              />
              <span className="text-xs text-cyan-500 hover:underline">
                I agree to the Terms of Service & Privacy Policy
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
            )}

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="receiveNewsletter"
                checked={formData.receiveNewsletter}
                onChange={handleChange}
                className="w-4 h-4 bg-white accent-cyan-500 cursor-pointer"
              />
              <span className="text-xs text-gray-600">
                Receive promotional information and news from Lang Chats
              </span>
            </label>
          </div>

          {/* ✅ Hiển thị lỗi từ server */}
          {errors.general && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
              {errors.general}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all"
          >
            {isLoading ? "Creating account..." : "Sign Up"} {/* ✅ Loading text */}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By signing up, you confirm that you have read and agree to the terms above.
          </p>
        </form>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center mx-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Account Created!
            </h3>
            <p className="text-gray-600 mb-8">
              Your account has been successfully registered. Please log in to continue.
            </p>
            <button
              onClick={handleGoToLogin}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  )
}