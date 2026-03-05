"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircle, Layers, Columns, ChevronLeft, ChevronRight } from "lucide-react";

import pic9  from "../assets/pic9.jpg";
import pic10 from "../assets/pic10.jpg";
import pic11 from "../assets/pic11.jpg";
import pic22 from "../assets/pic22.jpg";
import pic13 from "../assets/pic13.jpg";
import pic14 from "../assets/pic14.jpg";
import pic15 from "../assets/pic15.jpg";
import pic16 from "../assets/pic16.jpg";
import pic17 from "../assets/pic17.jpg";
import pic18 from "../assets/pic18.jpg";

const templates = [
  { id: 1,  title: "Modern",       image: pic9  },
  { id: 2,  title: "Classic",      image: pic10 },
  { id: 3,  title: "Creative",     image: pic11 },
  { id: 4,  title: "Professional", image: pic22 },
  { id: 5,  title: "Dark Mode",    image: pic13 },
  { id: 6,  title: "Minimalist",   image: pic14 },
  { id: 7,  title: "Academic",     image: pic15 },
  { id: 8,  title: "Tech",         image: pic16 },
  { id: 9,  title: "Bold",         image: pic17 },
  { id: 10, title: "Elegant",      image: pic18 },
];

const features = [
  { icon: <CheckCircle className="h-7 w-7 text-green-500" />,  text: "ATS-friendly professionally designed resumes" },
  { icon: <Layers      className="h-7 w-7 text-blue-500" />,   text: "Customizable sections, fonts, colors, and backgrounds" },
  { icon: <Columns     className="h-7 w-7 text-indigo-500" />, text: "Single-column, double-column, and multiple-page layouts" },
];

const TEMPLATES_PER_PAGE = 5;
const totalPages = Math.ceil(templates.length / TEMPLATES_PER_PAGE);

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: 0, opacity: 1, zIndex: 1 },
  exit:  (dir) => ({ x: dir < 0 ? "60%" : "-60%", opacity: 0, zIndex: 0 }),
};

function TemplateShowcase() {
  const [page, setPage]           = useState(0);
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
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Pick a template and build your resume in minutes!
          </h2>
        </motion.div>

        {/* ── Desktop Carousel (hidden on mobile) ── */}
        <div className="hidden sm:block relative px-8 lg:px-10">
          {/* Prev */}
          <button
            onClick={() => handlePaginate((page - 1 + totalPages) % totalPages)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black backdrop-blur-sm rounded-full h-9 w-9 flex items-center justify-center shadow-md transition-all text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Viewport — aspect-ratio drives height instead of fixed px */}
          <div className="overflow-hidden relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="grid grid-cols-5 gap-3 lg:gap-4"
              >
                {currentTemplates.map((template) => (
                  <div key={template.id}
                    className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden"
                  >
                    {/* aspect-[3/4] keeps card proportional at any width */}
                    <div className="aspect-[3/4] w-full overflow-hidden">
                      <img src={template.image} alt={template.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="px-2 py-2 text-center">
                      <p className="text-xs font-semibold text-gray-600 truncate">{template.title}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next */}
          <button
            onClick={() => handlePaginate((page + 1) % totalPages)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black backdrop-blur-sm rounded-full h-9 w-9 flex items-center justify-center shadow-md transition-all text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Mobile Scroll Grid (hidden on sm+) ── */}
        <div className="sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <div key={template.id}
                className="group cursor-pointer bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img src={template.image} alt={template.title}
                    className="w-full h-full object-cover object-top" />
                </div>
                <div className="px-2 py-1.5 text-center">
                  <p className="text-xs font-semibold text-gray-600 truncate">{template.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots — desktop only */}
        <div className="hidden sm:flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => handlePaginate(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                page === i ? "bg-cyan-500 w-5" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>

        {/* Feature Blurbs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-16"
        >
          {features.map((feature, i) => (
            <div key={i} className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 text-left sm:text-center">
              <div className="flex-shrink-0 sm:mb-3">{feature.icon}</div>
              <p className="text-sm sm:text-base text-gray-600 sm:max-w-xs">{feature.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Browse Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8 sm:mt-12"
        >
          <button className="inline-flex items-center gap-1.5 text-cyan-500 hover:text-cyan-600 font-semibold text-sm sm:text-base transition-colors">
            Browse Resume Templates →
          </button>
        </motion.div>

      </div>
    </section>
  );
}

export default TemplateShowcase;