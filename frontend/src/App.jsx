import './index.css'
import { Routes, Route } from "react-router-dom"
import AuthPage from "./app/auth/page"

// Trang Home là chính App.jsx với các component sẵn có
import Header from './components/header'
import Hero from './components/hero'
import TemplateShowcase from "./components/template-showcase"
import SocialProof from "./components/social-proof"
import ATSSection from "./components/ats-section"
import CareerTools from "./components/career-tools"
import Testimonials from "./components/testimonials"
import AISection from "./components/ai-section"
import Footer from "./components/footer"

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <TemplateShowcase />
      <SocialProof />
      <ATSSection />
      <Testimonials />
      <CareerTools />
      <AISection />
      <Footer />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />       {/* Trang gốc */}
      <Route path="/auth" element={<AuthPage />} /> {/* Trang SignIn/SignUp */}
    </Routes>
  )
}

export default App
