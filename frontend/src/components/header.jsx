"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"

function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-cyan-500">HIREWISE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/upload-cv" className="text-gray-600 hover:text-gray-900 transition">
              Upload CV
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900 transition">
              Resources
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900 transition">
              Career Center
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900 transition">
              Blog
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900 transition">
              Pricing
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900 transition">
              For Organizations
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 transition">Sign in</button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition font-medium"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header 