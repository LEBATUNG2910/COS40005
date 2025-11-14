"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { title } from "framer-motion/client";

// --- SVG Icons for Mobile Menu ---
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
// --- End SVG Icons ---

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define nav links in one place
  const navLinks = [
    { title: "Upload CV", path:'/upload'},
    { title: "Resources", path: "#" },
    { title: "Career Center", path: "#" },
    { title: "Blog", path: "#" },
    { title: "Pricing", path: "#" },
    { title: "For Organizations", path: "#" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      // Added relative positioning for the dropdown
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-cyan-500">HIREWISE</span>
          </Link>

          {/* --- Desktop Nav --- */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className="text-black hover:text-gray-900 transition"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* --- Desktop Auth Buttons --- */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth" className="text-black hover:text-gray-900 transition">
              Sign in
            </Link>
            <Link to="/process">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition font-medium"
            >
              Get Started
            </motion.button>
            </Link>
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700"
            >
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Dropdown --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            // This panel is hidden on md screens and up
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200"
          >
            <nav className="flex flex-col p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  className="py-2 px-3 rounded hover:bg-gray-100 transition text-black"
                  // Close menu on link click
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
              
              {/* Add mobile auth buttons */}
              <div className="border-t border-gray-100 my-2"></div>
              
              <button className="py-2 px-3 rounded hover:bg-gray-100 transition text-black text-left">
                Sign in
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition font-medium w-full mt-2"
              >
                Get Started
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;