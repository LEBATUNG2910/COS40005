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

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/auth" || location.pathname === "/account";

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
          </Routes>
        </main>

        {!hideLayout && <Footer />}
      </div>
    </FileProvider>
  );
}

export default App;