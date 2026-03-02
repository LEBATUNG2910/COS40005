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

// 🔥 IMPORT THE CONTEXT PROVIDER
import { FileProvider } from "./context/FileContext";

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/auth";

  return (
    // 🔥 WRAP EVERYTHING WITH FILEPROVIDER
    <FileProvider>
      <div className="min-h-screen flex flex-col">
        {/* Only render Header if hideLayout is false */}
        {!hideLayout && <Header />}

        <main className="flex-grow">
          <Routes>
            {/* ✅ Trang công khai — ai cũng vào được */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/process" element={<HowItWork />} />
            <Route path="/resource" element={<Resource />} />
            <Route path="/organize" element={<ForOrganizations />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/career-center" element={<CareerCenterPage />} />

            {/* 🔒 Trang bảo vệ — phải đăng nhập mới vào được */}
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
          </Routes>
        </main>

        {/* Only render Footer if hideLayout is false */}
        {!hideLayout && <Footer />}
      </div>
    </FileProvider>
  );
}

export default App;
