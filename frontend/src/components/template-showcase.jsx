"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// --- Local Image Imports ---
// Make sure these paths are correct for your project structure
import resume1 from "../assets/resume1.jpg";
import classic from "../assets/classic.png";
import creative from "../assets/creative.jpg";
import profes from "../assets/profes.png"
import darkresume from "../assets/dark-resume.jpg"
import pic21 from "../assets/pic21.jpg"
import pic22 from "../assets/pic22.jpg"
import pic23 from "../assets/pic23.jpg"
import pic24 from "../assets/pic24.jpg"
import pic25 from "../assets/pic25.jpg"

// --- SVG Icons ---
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LayersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-blue-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const ColumnsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
    />
  </svg>
);
// --- End SVG Icons ---

// --- Custom Hook for Window Size ---
// This hook helps us detect if we are on mobile or desktop
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Set size on mount
    handleResize();
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures this effect runs only on mount and unmount

  return windowSize;
}
// --- End Custom Hook ---


function TemplateShowcase() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Get window width
  const { width } = useWindowSize();
  const isMobile = width < 768; // Tailwind's 'md' breakpoint

  const templates = [
    { id: 1, title: "Modern", query: "modern resume", dark: false, img: resume1 },
    { id: 2, title: "Classic", query: "classic resume", dark: false, img: classic },
    { id: 3, title: "Creative", query: "creative resume", dark: false, img: creative },
    { id: 4, title: "Professional", query: "professional resume", dark: false, img: profes },
    { id: 5, title: "Dark Mode", query: "dark resume", dark: true, img: darkresume },
    { id: 6, title: "Minimalist", query: "minimal resume", dark: false, img: pic21 },
    { id: 7, title: "Academic", query: "academic cv", dark: false, img: pic22 },
    { id: 8, title: "Tech", query: "tech resume", dark: false, img: pic23 },
    { id: 9, title: "Bold", query: "bold resume", dark: false, img: pic24 },
    { id: 10, title: "Elegant", query: "elegant resume", dark: true, img: pic25 },
  ];

  const features = [
    {
      icon: <CheckCircleIcon />,
      text: "ATS-friendly professionally designed resumes",
    },
    {
      icon: <LayersIcon />,
      text: "Customizable sections, fonts, colors, and backgrounds",
    },
    {
      icon: <ColumnsIcon />,
      text: "Single-column, double-column, and multiple-page layouts",
    },
  ];

  // --- Responsive Pagination Logic ---
  const TEMPLATES_PER_PAGE_DESKTOP = 5;
  const TEMPLATES_PER_PAGE_MOBILE = 1;

  const templatesPerPage = isMobile ? TEMPLATES_PER_PAGE_MOBILE : TEMPLATES_PER_PAGE_DESKTOP;
  const totalPages = Math.ceil(templates.length / templatesPerPage);
  const gridCols = isMobile ? 'grid-cols-1' : 'md:grid-cols-5';
  
  // Reset page if totalPages changes (e.g., on resize)
  useEffect(() => {
    setPage(0);
  }, [totalPages]);
  // --- End Responsive Pagination Logic ---


  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDirection(1); // Always move forward
      setPage((prevPage) => (prevPage + 1) % totalPages);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isPaused, totalPages]);

  const handlePaginate = (newPage) => {
    // Manually handle pagination direction
    const newDirection = newPage > page ? 1 : -1;
    // Handle wrap-around cases
    if (newPage === 0 && page === totalPages - 1) {
        setDirection(1);
    } else if (newPage === totalPages - 1 && page === 0) {
        setDirection(-1);
    } else {
        setDirection(newDirection);
    }
    setPage(newPage);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const currentTemplates = templates.slice(
    page * templatesPerPage,
    (page + 1) * templatesPerPage
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Pick a template and build your resume in minutes!
          </h2>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={() => handlePaginate((page - 1 + totalPages) % totalPages)}
            className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 z-20 bg-white/70 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center shadow-md hover:bg-black transition-all"
          >
            &#8249;
          </button>
          <button
            onClick={() => handlePaginate((page + 1) % totalPages)}
            className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 z-20 bg-white/70 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center shadow-md hover:bg-black transition-all"
          >
            &#8250;
          </button>

          {/* Carousel Viewport */}
          {/* Set a fixed height for the viewport to avoid layout shift */}
          <div className="overflow-hidden relative h-[340px] sm:h-[340px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                // Apply responsive grid columns
                className={`grid ${gridCols} gap-4 absolute w-full`}
              >
                {currentTemplates.map((template) => {
                  const placeholderSrc = template.dark
                    ? `https://placehold.co/300x400/1F2937/E5E7EB?text=${template.title}+Resume`
                    : `https://placehold.co/300x400/FFFFFF/374151?text=${template.title}+Resume`;
                  
                  // Use local image if available, otherwise use placeholder
                  const imageSrc = template.img || placeholderSrc;

                  return (
                    <div
                      key={template.id}
                      // For mobile, we need to center the single item
                      className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-300 overflow-hidden sm:max-w-xs mx-auto w-full max-w-sm"
                    >
                      <div className="h-[340px] overflow-hidden">
                        <img
                          src={imageSrc}
                          alt={template.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to placeholder if local image fails
                            e.currentTarget.src = placeholderSrc;
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePaginate(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                page === i ? "bg-indigo-600 w-4" : "bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Feature Blurbs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {features.map((feature, index) => (
            <div key={index} className="text-center flex flex-col items-center">
              <div className="mb-3">{feature.icon}</div>
              <p className="text-gray-600 max-w-xs">{feature.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Browse Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Browse Resume Templates →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default TemplateShowcase;