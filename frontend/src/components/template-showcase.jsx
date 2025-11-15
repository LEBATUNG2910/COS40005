"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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

function TemplateShowcase() {
    const [page, setPage] = useState(0);

    const templates = [
        { id: 1, title: "Modern", query: "modern resume", dark: false },
        { id: 2, title: "Classic", query: "classic resume", dark: false },
        { id: 3, title: "Creative", query: "creative resume", dark: false },
        {
            id: 4,
            title: "Professional",
            query: "professional resume",
            dark: false,
        },
        { id: 5, title: "Dark Mode", query: "dark resume", dark: true },
        { id: 6, title: "Minimalist", query: "minimal resume", dark: false },
        { id: 7, title: "Academic", query: "academic cv", dark: false },
        { id: 8, title: "Tech", query: "tech resume", dark: false },
        { id: 9, title: "Bold", query: "bold resume", dark: false },
        { id: 10, title: "Elegant", query: "elegant resume", dark: true },
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

    const TEMPLATES_PER_PAGE = 5;
    const totalPages = Math.ceil(templates.length / TEMPLATES_PER_PAGE);

    const paginate = (newPage) => {
        setPage(newPage);
    };

    const nextPage = () => {
        setPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setPage((prev) => (prev - 1 + totalPages) % totalPages);
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

    // We need to track direction for the animation
    const [direction, setDirection] = useState(0);
    const handlePaginate = (newPage) => {
        setDirection(newPage > page ? 1 : -1);
        setPage(newPage);
    };

    const currentTemplates = templates.slice(
        page * TEMPLATES_PER_PAGE,
        (page + 1) * TEMPLATES_PER_PAGE,
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
                        className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 z-20 bg-black/70 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center shadow-md hover:bg-black transition-all"
                    >
                        &#8249;
                    </button>
                    <button
                        onClick={() => handlePaginate((page + 1) % totalPages)}
                        className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 z-20 bg-black/70 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center shadow-md hover:bg-black transition-all"
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
                                {currentTemplates.map((template) => {
                                    const placeholderSrc = template.dark
                                        ? `https://placehold.co/300x400/1F2937/E5E7EB?text=${template.title}+Resume` // Dark bg, light text
                                        : `https://placehold.co/300x400/FFFFFF/374151?text=${template.title}+Resume`; // White bg, dark text

                                    return (
                                        <div
                                            key={template.id}
                                            className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 overflow-hidden"
                                        >
                                            <div className="h-[380px]">
                                                <img
                                                    src={placeholderSrc}
                                                    alt={template.title}
                                                    className="object-cover w-full h-full object-top group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.currentTarget.src = `https://placehold.co/300x400/F9FAFB/374151?text=Preview+Error`;
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
                                page === i ? "bg-indigo-600 w-4" : "bg-gray-900"
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
                            <p className="text-gray-600 max-w-xs">
                                {feature.text}
                            </p>
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
