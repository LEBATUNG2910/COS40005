"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // New state for mobile user submenu
  const [isMobileUserSubmenuOpen, setIsMobileUserSubmenuOpen] = useState(false);

  // Define nav links in one place
  const navLinks = [
    { title: "Blog", path: "/resource" },
    { title: "Career Center", path: "#" },
    { title: "Pricing", path: "#" },
    { title: "For Organizations", path: "#" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          
          {/* --- Logo --- */}
          <Link to="/" className="flex items-center text-xl font-bold">
            <img
              src="/typhoon.png"
              alt="HireWise Logo"
              className="h-7 w-auto mr-2"
            />
            <span className="text-cyan-500">HIREWISE</span>
          </Link>

          {/* --- Desktop Nav --- */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className="text-sm font-medium text-gray-600 hover:text-black transition"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* --- Desktop Auth Buttons --- */}
          <div className="hidden md:flex items-center gap-3">
            <div 
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button className="text-gray-600 hover:text-black transition pt-1">
                <User className="w-5 h-5"/>
              </button>
              
              {/* Desktop User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      Account
                    </Link>
                    <Link
                      to="/auth"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      Logout
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link to="/process">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 text-sm rounded-lg transition font-medium">
                Get Started
              </button>
            </Link>
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200"
          >
            <nav className="flex flex-col p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  className="py-2 px-3 rounded hover:bg-gray-100 transition text-black text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}

          
              
              {/* --- Mobile User Dropdown Toggle --- */}
              <div>
                <button
                  onClick={() => setIsMobileUserSubmenuOpen(!isMobileUserSubmenuOpen)}
                  className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 transition text-black text-sm font-medium"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      isMobileUserSubmenuOpen ? "rotate-180" : ""
                    }`} 
                  />
                </button>

                {/* Submenu Items */}
                <AnimatePresence>
                  {isMobileUserSubmenuOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50 rounded-lg mt-1"
                    >
                      <Link
                        to="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 px-3 pl-9 text-sm text-gray-600 hover:text-black hover:bg-gray-100 transition"
                      >
                        Account
                      </Link>
                      <Link
                        to="/auth"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 px-3 pl-9 text-sm text-gray-600 hover:text-black hover:bg-gray-100 transition"
                      >
                        Logout
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/process" onClick={() => setIsMobileMenuOpen(false)}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 text-sm rounded-lg transition font-medium w-full mt-4"
                >
                  Get Started
                </motion.button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;