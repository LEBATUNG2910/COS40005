"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import SignUp from "../signup/sign_up"
import SignIn from "../signin/sign_in"


export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">

          {/* --- CHANGE 2 & 3: Flex container for Logo + Text with shared animation --- */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-2" // Added flex layout centering
          >
            {/* Added Image */}
            <img
              src='./typhoon.png'
              alt="Hirewise Logo"
              className="h-12 w-auto mr-3" // Sizing and spacing right
            />
            {/* H1 is no longer a motion component itself, just standard H1 */}
            <h1 className="text-4xl font-bold text-cyan-500">
              HIREWISE
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-600"
          >
            {/* Add a subtitle here if needed */}
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-4 mb-8"
        >
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              !isSignUp
                ? "bg-white text-blue-500 shadow-lg"
                : "bg-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              isSignUp
                ? "bg-white text-blue-500 shadow-lg"
                : "bg-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </motion.div>

        {/* Animated Form Container */}
        <div>
          <AnimatePresence mode="wait">
            {isSignUp ? (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <SignUp />
              </motion.div>
            ) : (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <SignIn />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}