import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Crown, Check, Zap, AlertCircle, Loader2, Eye, EyeOff, X } from "lucide-react";
import { authService } from "../../services/authService";

function Account() {
  // ── User State ───────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Profile Form ─────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [language, setLanguage] = useState("English");
  const [newsletter, setNewsletter] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // ── Change Password Modal ─────────────────────────────────
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  // ── Billing ───────────────────────────────────────────────
  const [billingCycle, setBillingCycle] = useState("yearly");

  // ── Fetch user khi mount ──────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = authService.getToken();
        if (!token) { window.location.href = '/auth'; return; }

        const res = await fetch('http://localhost:3001/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.status === 401) { authService.logout(); window.location.href = '/auth'; return; }
        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        setUser(data);
        setFullName(data.fullName || '');
        setLanguage(data.language || 'English');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ── Lưu profile ──────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, language }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setUser(data.user);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // ── Đổi password ─────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordError(null);

    // Validate phía frontend trước
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:3001/api/auth/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');

      // Thành công
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
      }, 2000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  // ── Loading / Error screens ───────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
          <p className="text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">Could not load profile</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-600 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-sm p-6">
              <a href="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition mb-6">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </a>

              {/* Avatar + tên */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-cyan-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900 truncate">{fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-50 text-cyan-600 font-medium">
                  <div className="w-3 h-3 rounded-full border-2 border-cyan-600 ml-1"></div>
                  Your Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                  <div className="w-3 h-3 rounded border-2 border-gray-400 ml-1"></div>
                  Billing
                </button>
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col xl:flex-row gap-6">

            {/* Profile Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

              {/* Full Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Email (readonly) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900 mb-1">{user?.email}</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Change Email Address</button>
              </div>

              {/* Phone (readonly) */}
              {user?.phoneNumber && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <p className="text-gray-900">{user.phoneNumber}</p>
                </div>
              )}

              {/* Gender (readonly) */}
              {user?.gender && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <p className="text-gray-900 capitalize">{user.gender}</p>
                </div>
              )}

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <p className="text-gray-900 mb-1">••••••••••••••••</p>
                {/* ✅ Mở modal đổi password */}
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Change Password
                </button>
              </div>

              {/* Language ✅ có thể chỉnh sửa */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
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
                  <span className="text-gray-700">Get inspiring resume examples and advice with our newsletter</span>
                </label>
              </div>

              {/* ✅ Save error */}
              {saveError && (
                <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg mb-4">{saveError}</p>
              )}

              {/* ✅ Save Changes button */}
              <div className="mb-6">
                <button
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center gap-2"
                >
                  {saveLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : saveSuccess ? (
                    <><Check className="w-4 h-4" /> Saved!</>
                  ) : 'Save Changes'}
                </button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Account</h3>
                <button
                  onClick={() => { authService.logout(); window.location.href = '/auth'; }}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium mr-4"
                >
                  Sign Out
                </button>
                <button className="text-red-500 hover:text-red-600 text-sm font-medium">Delete Account</button>
              </div>
            </motion.div>

            {/* Pro Upgrade Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1 bg-white rounded-lg shadow-sm border-2 border-cyan-500 p-6 flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Get more with Pro</h2>
                  <p className="text-sm text-gray-500 mt-1">Unlock your full potential</p>
                </div>
                <div className="bg-cyan-100 p-2 rounded-full">
                  <Crown className="w-6 h-6 text-cyan-600" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-gray-700">Free Plan Limit Reached</span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1"><span>Resumes</span><span>1 / 1</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full w-full"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1"><span>Cover Letters</span><span>0 / 1</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-gray-300 h-2 rounded-full w-0"></div></div>
                </div>
              </div>

              <div className="bg-gray-100 p-1 rounded-lg flex mb-6">
                <button onClick={() => setBillingCycle('monthly')} className={`flex-1 py-2 text-sm font-medium rounded-md transition ${billingCycle === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Monthly</button>
                <button onClick={() => setBillingCycle('yearly')} className={`flex-1 py-2 text-sm font-medium rounded-md transition ${billingCycle === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                  Yearly <span className="text-xs text-green-600 font-bold ml-1">-20%</span>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900">
                  {billingCycle === 'yearly' ? '$3.23' : '$5.00'}
                  <span className="text-sm font-normal text-gray-500"> / month</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{billingCycle === 'yearly' ? 'Billed $38.76 yearly' : 'Billed monthly'}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {['Unlimited resumes & cover letters', 'Access to premium templates', 'AI-powered content suggestions', 'Remove branding from PDF'].map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Upgrade to Pro
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ✅ Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closePasswordModal}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                <button onClick={closePasswordModal} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Success state */}
              {passwordSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-gray-800 font-semibold">Password changed successfully!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none pr-10"
                      />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                        placeholder="Min. 8 characters"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none pr-10"
                      />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={passwordForm.confirmNewPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, confirmNewPassword: e.target.value }))}
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none pr-10"
                      />
                      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {passwordError && (
                    <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{passwordError}</p>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closePasswordModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword}
                      className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 disabled:cursor-not-allowed text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
                    >
                      {passwordLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Change Password'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Account;