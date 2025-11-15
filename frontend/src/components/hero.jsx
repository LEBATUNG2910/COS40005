"use client"

import { motion } from "framer-motion"
import { MessageSquare, CheckSquare } from "lucide-react"

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }
  
  // --- Data cho các thẻ trôi nổi ---
  const floatingCards = [
    {
      id: 1,
      tag: "Meh",
      tagColor: "bg-purple-100 text-purple-700",
      title: "AI Resume Optimization",
      description: "Get instant feedback on your resume with AI-powered suggestions.",
      avatars: [
        { src: "https://placehold.co/32x32/FF6B6B/FFFFFF?text=A", alt: "User 1" },
        { src: "https://placehold.co/32x32/4ECDC4/FFFFFF?text=B", alt: "User 2" },
        { src: "https://placehold.co/32x32/45B7D1/FFFFFF?text=C", alt: "User 3" },
        { src: "https://placehold.co/32x32/FFA07A/FFFFFF?text=D", alt: "User 4" },
      ],
      stats: { views: "21.8K", comments: 32, tasks: 115 },
      position: { top: "10%", left: "-5%", rotate: -3 },
      delay: 0,
    },
    {
      id: 2,
      tag: "Important",
      tagColor: "bg-blue-100 text-blue-700",
      title: "Smart Job Matching",
      description: "Match your skills with the perfect job opportunities using AI.",
      avatars: [
        { src: "https://placehold.co/32x32/9B59B6/FFFFFF?text=E", alt: "User 5" },
        { src: "https://placehold.co/32x32/3498DB/FFFFFF?text=F", alt: "User 6" },
      ],
      stats: { views: "18.3K", comments: 45, tasks: 89 },
      position: { top: "35%", right: "-5%", rotate: 2 },
      delay: 0.3,
    },
    {
      id: 3,
      tag: "New",
      tagColor: "bg-green-100 text-green-700",
      title: "Interview Preparation",
      description: "Practice with AI-generated interview questions tailored to your role.",
      avatars: [
        { src: "https://placehold.co/32x32/E74C3C/FFFFFF?text=G", alt: "User 7" },
        { src: "https://placehold.co/32x32/F39C12/FFFFFF?text=H", alt: "User 8" },
        { src: "https://placehold.co/32x32/27AE60/FFFFFF?text=I", alt: "User 9" },
      ],
      stats: { views: "15.2K", comments: 28, tasks: 67 },
      position: { bottom: "15%", left: "5%", rotate: -2 },
      delay: 0.6,
    },
    {
  id: 4,
  tag: "Hot",
  tagColor: "bg-red-100 text-red-700",
  title: "AI Cover Letter Generator",
  description: "Generate personalized cover letters tailored to the job you're applying for.",
  avatars: [
    { src: "https://placehold.co/32x32/1ABC9C/FFFFFF?text=J", alt: "User 10" },
    { src: "https://placehold.co/32x32/2ECC71/FFFFFF?text=K", alt: "User 11" },
    { src: "https://placehold.co/32x32/E67E22/FFFFFF?text=L", alt: "User 12" },
  ],
  stats: { views: "19.4K", comments: 51, tasks: 102 },
  position: { bottom: "5%", right: "0%", rotate: 3 },
  delay: 0.9,
},
  ];
  // --- Kết thúc data ---


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Nền Gradient mờ */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 opacity-20" />
      <div className="absolute inset-0 bg-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* --- Cột bên trái (Nội dung) --- */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Build your resume with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">HIREWISE</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 leading-relaxed">
              AI-powered resume builder that gets you more interviews. Stand out with professionally crafted resumes.
            </motion.p>
            


            {/* --- Các nút bấm --- */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Build Your Resume
              </button>
              <button
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition"
              >
                Get Your Resume Score
              </button>
            </motion.div>

            <motion.div variants={itemVariants}>
              {/* 2. Phần text */}
              <div className="flex flex-wrap items-center gap-x-5 text-sm text-gray-600 mt-5">
                <span className="font-bold">4,988 Reviews on Trustpilot</span>
                <span>28,482 users achieved their dream jobs</span>
              </div>
              1. Các ngôi sao
              <div className="flex gap-1 mb-2 ml-10">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* --- Cột bên phải (UI Động với nhiều thẻ trôi nổi) --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative h-96 md:h-full min-h-[500px]"
          >
            {/* Nền Wavy */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <motion.div 
                animate={{
                  transform: ['translateX(-10%) translateY(-10%)', 'translateX(10%) translateY(10%)'],
                }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
                // className="absolute -inset-20 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 opacity-60 blur-3xl" 
              />
              <motion.div 
                animate={{
                  transform: ['translateX(10%) translateY(10%)', 'translateX(-10%) translateY(-10%)'],
                }}
                transition={{
                  duration: 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
                // className="absolute -inset-20 bg-gradient-to-tl from-cyan-300 via-blue-400 to-indigo-500 opacity-60 blur-3xl" 
              />
            </div>

            {/* --- NHIỀU THẺ TRÔI NỔI --- */}
            {floatingCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ 
                  opacity: 1,
                  y: [0, -10, 0],
                  scale: 1,
                  rotate: card.position.rotate,
                }}
                transition={{ 
                  opacity: { duration: 0.6, delay: card.delay },
                  scale: { duration: 0.6, delay: card.delay },
                  y: {
                    duration: 4 + card.id,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: card.delay,
                  },
                }}
                style={{
                  position: 'absolute',
                  ...card.position,
                }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-white/50 w-72 cursor-pointer"
              >
                {/* Tag */}
                <div className={`inline-block ${card.tagColor} px-3 py-1 rounded-full text-xs font-semibold mb-3`}>
                  {card.tag}
                </div>
                
                {/* Nội dung thẻ */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {card.description}
                </p>
                
                {/* --- PHẦN AVATARS VÀ STATS --- */}
                <div className="flex justify-between items-center">
                  {/* Avatars với views */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center -space-x-2">
                      {card.avatars.slice(0, 3).map((avatar, i) => (
                        <img
                          key={i}
                          src={avatar.src}
                          alt={avatar.alt}
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                      ))}
                      {card.avatars.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{card.avatars.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{card.stats.views}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">{card.stats.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <CheckSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">{card.stats.tasks}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
          </motion.div>
        </div>
      </div>
    </section>
  )
}
export default Hero