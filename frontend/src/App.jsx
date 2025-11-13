import './index.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/header'
import Hero  from './components/hero'
import SocialProof  from "./components/social-proof"
import TemplateShowcase  from "./components/template-showcase"
import Features from "./components/features"
import ATSSection  from "./components/ats-section"
import CareerTools  from "./components/career-tools"
import Testimonials from "./components/testimonials"
import AISection  from "./components/ai-section"
import Footer  from "./components/footer"
import CVUpload from "./components/cv-upload"

function HomePage() {
  return (
    <>
      <Hero/>
      <SocialProof />
      <TemplateShowcase />
      <Features />
      <ATSSection />
      <CareerTools />
      <Testimonials />
      <AISection />
    </>
  )
}

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload-cv" element={<CVUpload />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
