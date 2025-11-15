"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react"; // Giữ lại icon này cho các nút

// --- Component Chính ---
export default function HowItWorks() {
  // Dữ liệu cho các bước
  const steps = [
    { id: 1, name: "Start" },
    { id: 2, name: "Customize" },
    { id: 3, name: "Finish" },
  ];
  const currentStep = 1; // Đặt bước hiện tại là 1

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6 relative">
      
      {/* --- Header: Steps và Nút Login --- */}
      <div className="absolute top-0 left-0 right-0 w-full max-w-5xl mx-auto px-6 pt-8">
        <div className="flex justify-center items-center">
          
          {/* Thanh tiến trình (Steps) */}
          <nav className="flex items-center space-x-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: step.id === currentStep ? 1.1 : 1,
                    backgroundColor:
                      step.id === currentStep
                        ? "#10B981" // Green-500
                        : "#D1D5DB", // Gray-300
                    borderColor:
                      step.id === currentStep
                        ? "#10B981" // Green-500
                        : "#D1D5DB", // Gray-300
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                >
                  {step.id}
                </motion.div>
                {step.id < steps.length && (
                  <div className="w-16 h-0.5 bg-gray-300" />
                )}
              </div>
            ))}
          </nav>

          {/* Nút Login */}
          {/* <Link to="/auth">
            <button className="text-sm font-semibold text-gray-700 hover:text-black border border-gray-300 px-4 py-1.5 rounded-lg transition-colors">
              Login
            </button>
          </Link> */}
        </div>
      </div>

      {/* --- Nội dung chính --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center flex flex-col items-center"
      >
        {/* User Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative"
            >
              {/* Decorative shapes */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-12 opacity-10"
              >
                <svg viewBox="0 0 200 200" className="w-32 h-32">
                  <circle cx="100" cy="50" r="40" fill="#06B6D4" />
                  <circle cx="150" cy="120" r="30" fill="#EC4899" />
                  <circle cx="50" cy="130" r="35" fill="#10B981" />
                </svg>
              </motion.div>

              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 via-cyan-100 to-teal-100 flex items-center justify-center overflow-hidden shadow-xl">
                <div className="text-6xl">👤</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Câu hỏi */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          Do you have an existing resume to use as a starting point?
        </h2>

        {/* Các nút lựa chọn */}
        <div className="flex gap-4">
          <Link to="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-10 py-3 rounded-lg text-lg transition-colors shadow-md"
            >
              Yes
            </motion.button>
          </Link>

          <Link to="/templates"> {/* Giả sử "No" sẽ dẫn đến trang chọn template */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-10 py-3 rounded-lg text-lg transition-colors shadow-md"
            >
              No
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}