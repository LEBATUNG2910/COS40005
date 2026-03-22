import "./index.css";
import { Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./app/auth/page";
import { Home } from "./app/home/home";
import HowItWork from "./app/process/HowItWork";
import CvUpload from "./app/upload/cv-upload";
import Footer from "./components/footer";
import Header from "./components/header";
import ResumeTemplateSelection from "./app/selection/ResumeTemplateSelection";
import Resource from "./app/resource/Resource";
import Account from "./app/account/account";
import PrivateRoute from "./components/PrivateRoute";
import CvAnalyst from "./app/analyst/page";
import ForOrganizations from "./app/organize/page";
import PricingPage from "./app/pricing/page";
import CareerCenterPage from "./app/career-center/page";
import { FileProvider } from "./context/FileContext";
import ResumeBuilder from "./app/resume/page";
import Dashboard from "./app/dashboard/page";
import ComparePage from "./app/compare/page";
import ForgotPassword from "./app/forgot/page";
import VerifyEmail from "./app/verify-email/page";
import ResetPassword from "./app/reset/page";
import GoogleCallback from './app/auth/google/callback/google_callback'

function App() {
  const location = useLocation();
  const hideLayout = ["/auth", "/account", "/forgot", "/reset", "/reset-password", "/verify-email", "/auth/google/callback"].includes(location.pathname);

  return (
    <FileProvider>
      <div className="min-h-screen flex flex-col">
        {!hideLayout && <Header />}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/process" element={<HowItWork />} />
            <Route path="/resource" element={<Resource />} />
            <Route path="/organize" element={<ForOrganizations />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/career-center" element={<CareerCenterPage />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />

            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <CvUpload />
                </PrivateRoute>
              }
            />
            <Route
              path="/selection"
              element={
                <PrivateRoute>
                  <ResumeTemplateSelection />
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="/analyst"
              element={
                <PrivateRoute>
                  <CvAnalyst />
                </PrivateRoute>
              }
            />
            <Route
              path="/resume"
              element={
                <PrivateRoute>
                  <ResumeBuilder />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
            path="/compare"
              element={
                <PrivateRoute>
                  <ComparePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        {!hideLayout && <Footer />}
      </div>
    </FileProvider>
  );
}

export default App;