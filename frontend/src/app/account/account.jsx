import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, FileText, Edit3, X } from "lucide-react";

function Account() {
  const [fullName, setFullName] = useState("Le Ba Tung");
  const [email] = useState("bumieba2910@gmail.com");
  const [language, setLanguage] = useState("English");
  const [newsletter, setNewsletter] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header would go here */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <a
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </a>

              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-50 text-cyan-600 font-medium">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full border-2 border-cyan-600"></div>
                  </div>
                  Your Profile
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-3 h-3 rounded border-2 border-gray-400"></div>
                  </div>
                  Billing
                </button>
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

              {/* Full Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-900 mb-2">{email}</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Change Email Address
                </button>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <p className="text-gray-900 mb-2">••••••••••••••••</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Change Password
                </button>
              </div>

              {/* Language */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Vietnamese</option>
                </select>
              </div>

              {/* Newsletter */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="mt-1 w-5 h-5 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <span className="text-gray-700">
                    Get inspiring resume examples and advice with our newsletter
                  </span>
                </label>
              </div>

              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6">
                Change Cookie Preferences
              </button>

              {/* Delete Account */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Account</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </motion.div>

            {/* Pro Upgrade Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border-2 border-cyan-500 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Get more with Pro</h2>
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition font-medium">
                  Upgrade
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                <span className="font-semibold">For as little as $3.23 / m.</span> Starting from a month.
              </p>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">Add Pro Sections</span>
                </li>
                <li className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">Compact template</span>
                </li>
                <li className="flex items-center gap-3">
                  <Edit3 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited entries</span>
                </li>
                <li className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">300 resumes and cover letters</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">Remove branding</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm mb-4">
            Resumes recruiters love
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">Resume Examples</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900">Upgrade</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900">Blog</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900">help@enhancv.com</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900">Log Out</a>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            © 2026 Enhancv. All Rights Reserved.
          </p>
          <p className="text-center text-gray-400 text-xs mt-2">
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Account;