import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, FileText, Edit3, X, Check, Zap, AlertCircle } from "lucide-react";

function Account() {
  const [fullName, setFullName] = useState("Le Ba Tung");
  const [email] = useState("bumieba2910@gmail.com");
  const [language, setLanguage] = useState("English");
  const [newsletter, setNewsletter] = useState(true);
  
  // New state for the Pro Card functions
  const [billingCycle, setBillingCycle] = useState("yearly");

  return (
    <div className="bg-gray-50">
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
          <div className="lg:col-span-2 flex flex-col xl:flex-row gap-6">
            
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 bg-white rounded-lg shadow-sm p-6 h-full"
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
              // Added h-full and flex column layout to distribute content
              className="flex-1 bg-white rounded-lg shadow-sm border-2 border-cyan-500 p-6 h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Get more with Pro</h2>
                    <p className="text-sm text-gray-500 mt-1">Unlock your full potential</p>
                </div>
                <div className="bg-cyan-100 p-2 rounded-full">
                    <Crown className="w-6 h-6 text-cyan-600" />
                </div>
              </div>

              {/* NEW: Usage Stats (Adds height and context) */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold text-gray-700">Free Plan Limit Reached</span>
                </div>
                
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Resumes</span>
                        <span>1 / 1</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full w-full"></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Cover Letters</span>
                        <span>0 / 1</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-300 h-2 rounded-full w-0"></div>
                    </div>
                </div>
              </div>

              {/* NEW: Billing Cycle Toggle */}
              <div className="bg-gray-100 p-1 rounded-lg flex mb-6">
                <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${billingCycle === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Monthly
                </button>
                <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${billingCycle === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Yearly <span className="text-xs text-green-600 font-bold ml-1">-20%</span>
                </button>
              </div>

              {/* Price Display */}
              <div className="mb-6">
                 <p className="text-3xl font-bold text-gray-900">
                    {billingCycle === 'yearly' ? '$3.23' : '$5.00'}
                    <span className="text-sm font-normal text-gray-500"> / month</span>
                 </p>
                 <p className="text-sm text-gray-500 mt-1">
                    {billingCycle === 'yearly' ? 'Billed $38.76 yearly' : 'Billed monthly'}
                 </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Unlimited resumes & cover letters</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Access to premium templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">AI-powered content suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Remove branding from PDF</span>
                </li>
              </ul>

              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Upgrade to Pro
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;