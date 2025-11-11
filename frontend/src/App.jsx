import './index.css'
import Header from './components/header'
import Hero  from './components/hero'
import SocialProof  from "./components/social-proof"
import TemplateShowcase  from "./components/template-showcase"
import Features from "./components/features"
import ATSSection  from "./components/ats-section"
import CareerTools  from "./components/career-tools"
import Testimonials from "./components/testimonials"
import AISection  from "./components/ai-section"
import  Footer  from "./components/footer"
function App() {
  return (
    <>
    <Header/>
    <Hero/>
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

export default App
