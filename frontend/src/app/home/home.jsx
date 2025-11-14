import Header from '../../components/header'
import Hero from '../../components/hero'
import TemplateShowcase from "../../components/template-showcase"
import SocialProof from "../../components/social-proof"
import ATSSection from "../../components/ats-section"
import CareerTools from "../../components/career-tools"
import Testimonials from "../../components/testimonials"
import AISection from "../../components/ai-section"


export function Home() {
    return(
        <>
      <Hero />
      <TemplateShowcase />
      <SocialProof />
      <ATSSection />
      <Testimonials />
      <CareerTools />
      <AISection />
    </>
    )
}

export default Home;