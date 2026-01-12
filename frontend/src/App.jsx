import './index.css'
import { Routes, Route, useLocation } from "react-router-dom"
import AuthPage from "./app/auth/page"
import { Home } from './app/home/home'
import HowItWork from './app/process/HowItWork'
import CvUpload from './app/upload/cv-upload'
import Footer from './components/footer'
import Header from './components/header'
import ResumeTemplateSelection from './app/selection/ResumeTemplateSelection'
import Resource from './app/resource/Resource'
import Account from './app/account/account'
import CvAnalyst from './app/cv-analyst/page'

// 🔥 IMPORT THE CONTEXT PROVIDER
import { FileProvider } from './context/FileContext'

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === '/auth';

  return (
    // 🔥 WRAP EVERYTHING WITH FILEPROVIDER
    <FileProvider>
      <div className="min-h-screen flex flex-col">
        
        {/* Only render Header if hideLayout is false */}
        {!hideLayout && <Header/>}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path='/upload' element={<CvUpload/>} />
            <Route path='/process' element={<HowItWork/>} />
            <Route path='/selection' element={<ResumeTemplateSelection/>} />
            <Route path='/resource' element={<Resource/>} />
            <Route path='/account' element={<Account/>} />
            <Route path="/cv-analyst" element={<CvAnalyst />} />
          </Routes>
        </main>

        {/* Only render Footer if hideLayout is false */}
        {!hideLayout && <Footer />}
      </div>
    </FileProvider>
  )
}

export default App