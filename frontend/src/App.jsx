import './index.css'
import { Routes, Route, useLocation } from "react-router-dom"
import AuthPage from "./app/auth/page"
import { Home } from './app/home/home'
import HowItWork from './app/process/HowItWork'
import Footer from './components/footer'
import Header from './components/header'

function App() {
  const location = useLocation();
  const hideFooter = location.pathname === '/auth';

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path='/process' element={<HowItWork/>} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default App
