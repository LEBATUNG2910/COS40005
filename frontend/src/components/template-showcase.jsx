"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircle, Layers, Columns } from "lucide-react"; // Import Lucide icons

// --- Image Imports (Vite/Assets) ---
// Adjust the path '../assets/' based on where this component file is located relative to your assets folder
import pic9 from "../assets/pic9.jpg";
import pic10 from "../assets/pic10.jpg";
import pic11 from "../assets/pic11.jpg";
import pic12 from "../assets/pic12.jpg";
import pic13 from "../assets/pic13.jpg";
import pic14 from "../assets/pic14.jpg";
import pic15 from "../assets/pic15.jpg";
import pic16 from "../assets/pic16.jpg";
import pic17 from "../assets/pic17.jpg";
import pic18 from "../assets/pic18.jpg";

function TemplateShowcase() {
  const [page, setPage] = useState(0);

  // Map images to specific templates
  const templates = [
    { id: 1, title: "Modern", image: pic9 },
    { id: 2, title: "Classic", image: pic10 },
    { id: 3, title: "Creative", image: pic11 },
    { id: 4, title: "Professional", image: pic12 },
    { id: 5, title: "Dark Mode", image: pic13 },
    { id: 6, title: "Minimalist", image: pic14 },
    { id: 7, title: "Academic", image: pic15 },
    { id: 8, title: "Tech", image: pic16 },
    { id: 9, title: "Bold", image: pic17 },
    { id: 10, title: "Elegant", image: pic18 },
  ];

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      text: "ATS-friendly professionally designed resumes",
    },
    {
      icon: <Layers className="h-8 w-8 text-blue-500" />,
      text: "Customizable sections, fonts, colors, and backgrounds",
    },
    {
      icon: <Columns className="h-8 w-8 text-indigo-500" />,
      text: "Single-column, double-column, and multiple-page layouts",
    },
  ];

  const TEMPLATES_PER_PAGE = 5;
  const totalPages = Math.ceil(templates.length / TEMPLATES_PER_PAGE);

  const paginate = (newPage) => {
    setPage(newPage);
  };

  // Animation variants
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

  const [direction, setDirection] = useState(0);
  
  const handlePaginate = (newPage) => {
    setDirection(newPage > page ? 1 : -1);
    setPage(newPage);
  };

  const currentTemplates = templates.slice(
    page * TEMPLATES_PER_PAGE,
    (page + 1) * TEMPLATES_PER_PAGE
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
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() =>
              handlePaginate((page - 1 + totalPages) % totalPages)
            }
            className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 z-20 bg-black/70 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center shadow-md hover:bg-black transition-all text-white"
          >
            &#8249;
          </button>
          <button
            onClick={() => handlePaginate((page + 1) % totalPages)}
            className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 z-20 bg-black/70 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center shadow-md hover:bg-black transition-all text-white"
          >
            &#8250;
          </button>

          {/* Carousel Viewport */}
          <div className="overflow-hidden relative h-[420px]">
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="wait"
            >
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  },
                  opacity: { duration: 0.2 },
                }}
                className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 absolute w-full"
              >
                {currentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 overflow-hidden"
                  >
                    <div className="h-[380px] w-full relative">
                       {/* object-cover: Ensures image covers the area (no empty space).
                         object-top: Ensures the top of the resume is always visible if cropping occurs.
                       */}
                      <img
                        src={template.image}
                        alt={template.title}
                        className="object-top h-full w-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                ))}
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
                page === i ? "bg-cyan-500 w-4" : "bg-gray-900"
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
            <div
              key={index}
              className="text-center flex flex-col items-center"
            >
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
          <button className="text-cyan-500 hover:text-cyan-600 font-semibold">
            Browse Resume Templates →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default TemplateShowcase;