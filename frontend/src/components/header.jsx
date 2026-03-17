"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  User,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut,
  Settings,
  Loader2,
} from "lucide-react";
// Đảm bảo bạn đã có authService, mình comment tạm phần import nếu bạn đang test UI
import { authService } from "../services/authService";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileUserSubmenuOpen, setIsMobileUserSubmenuOpen] = useState(false);
  const [isMobileOrgSubmenuOpen, setIsMobileOrgSubmenuOpen] = useState(false); // Thêm state cho mobile dropdown
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!authService.getToken();

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsLoggingOut(true);
    await new Promise((res) => setTimeout(res, 900));
    authService.logout();
    setIsLoggingOut(false);
    navigate("/");
  };

  // Cập nhật cấu trúc navLinks có chứa dropdown
  const navLinks = [
    { title: "Blog", path: "/resource" },
    { title: "Career Center", path: "/career-center" },
    { title: "Pricing", path: "/pricing" },
    {
      title: "For Organizations",
      dropdown: [
        { title: "For Recruitment", path: "/organize?tab=recruitment" },
        { title: "Higher Education", path: "/organize?tab=higher-education" },
        { title: "Career Coaches", path: "/organize?tab=career-coaches" },
      ],
    },
    {title: "Compare Resumes", path: "/compare"},
  ];

  return (
    <>
      {/* --- Logout Loading Overlay --- */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
          >
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <p className="text-sm font-medium text-gray-500">Signing out...</p>
          </motion.div>
        )}
      </AnimatePresence>

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
              {navLinks.map((link) =>
                link.dropdown ? (
                  // Dropdown cho Desktop
                  <div key={link.title} className="relative group">
                    <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition py-2">
                      {link.title} <ChevronDown className="w-4 h-4" />
                    </button>
                    {/* Menu xổ xuống */}
                    <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden transform origin-top group-hover:scale-100 scale-95">
                      <div className="py-2">
                        {link.dropdown.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.path}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.title}
                    to={link.path}
                    className="text-sm font-medium text-gray-600 hover:text-black transition"
                  >
                    {link.title}
                  </Link>
                ),
              )}
            </nav>

            {/* --- Desktop Right Side --- */}
            <div className="hidden md:flex items-center gap-3">
              <div
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="text-gray-600 hover:text-black transition pt-1">
                  <User className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 overflow-hidden"
                    >
                      {isLoggedIn ? (
                        <>
                          <Link
                            to="/account"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Settings className="w-4 h-4 text-gray-400" />
                            Account
                          </Link>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/auth"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <LogIn className="w-4 h-4 text-gray-400" />
                            Sign In
                          </Link>
                          <Link
                            to="/auth?tab=signup"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-cyan-600 font-medium hover:bg-cyan-50 transition"
                          >
                            <UserPlus className="w-4 h-4" />
                            Sign Up
                          </Link>
                        </>
                      )}
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
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- Mobile Menu --- */}
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
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <div key={link.title}>
                      <button
                        onClick={() =>
                          setIsMobileOrgSubmenuOpen(!isMobileOrgSubmenuOpen)
                        }
                        className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 transition text-black text-sm font-medium"
                      >
                        {link.title}
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isMobileOrgSubmenuOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {isMobileOrgSubmenuOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50 rounded-lg mt-1 ml-2 border-l-2 border-cyan-100"
                          >
                            {link.dropdown.map((subItem) => (
                              <Link
                                key={subItem.title}
                                to={subItem.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-2.5 px-4 text-sm text-gray-600 hover:text-cyan-600 hover:bg-cyan-50/50 transition"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.title}
                      to={link.path}
                      className="py-2 px-3 rounded hover:bg-gray-100 transition text-black text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ),
                )}

                <div className="mt-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() =>
                      setIsMobileUserSubmenuOpen(!isMobileUserSubmenuOpen)
                    }
                    className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 transition text-black text-sm font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>
                        {isLoggedIn ? "My Account" : "Sign In / Sign Up"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isMobileUserSubmenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isMobileUserSubmenuOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50 rounded-lg mt-1"
                      >
                        {isLoggedIn ? (
                          <>
                            <Link
                              to="/account"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 py-2.5 px-4 text-sm text-gray-700 hover:bg-gray-100 transition"
                            >
                              <Settings className="w-4 h-4 text-gray-400" />{" "}
                              Account
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2 w-full py-2.5 px-4 text-sm text-red-500 hover:bg-red-50 transition"
                            >
                              <LogOut className="w-4 h-4" /> Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/auth"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 py-2.5 px-4 text-sm text-gray-700 hover:bg-gray-100 transition"
                            >
                              <LogIn className="w-4 h-4 text-gray-400" /> Sign
                              In
                            </Link>
                            <Link
                              to="/auth?tab=signup"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 py-2.5 px-4 text-sm text-cyan-600 font-medium hover:bg-cyan-50 transition"
                            >
                              <UserPlus className="w-4 h-4" /> Sign Up
                            </Link>
                          </>
                        )}
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
    </>
  );
}

export default Header;
