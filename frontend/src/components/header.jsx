"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Header() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 bg-white backdrop-blur-md"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                        <span className="text-cyan-500">HIREWISE</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            to="#"
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            Resources
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            Career Center
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            Blog
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            Pricing
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            For Organizations
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="text-gray-600 hover:text-gray-900 transition">
                            Sign in
                        </button>
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
    );
}

export default Header;
