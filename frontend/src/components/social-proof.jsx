"use client";

import { motion } from "framer-motion";

// A simple SVG component for the decorative swirls
const SwirlIcon = ({ className }) => (
    <svg
        // Updated swirl color to be subtle on the dark background
        className={`absolute w-32 h-32 text-blue-800 ${className}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M 10,10 C 20,80 80,20 90,90"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export default function SocialProof() {
    const stats = [
        { number: "15M+", label: "resumes created" },
        { number: "10M+", label: "resume examples" },
        { number: "11 years", label: "of helping job seekers" },
        { number: "1M+", label: "monthly blog readers" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    const textVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, delay: 0.4 },
        },
    };

    return (
        // Updated background gradient
        <section className="relative py-20 bg-gradient-to-r from-blue-900 to-black overflow-hidden">
            {/* Decorative Swirls */}
            <SwirlIcon className="top-0 left-0 -translate-x-1/4 -translate-y-1/4 opacity-50" />
            <SwirlIcon className="bottom-0 right-0 translate-x-1/4 translate-y-1/4 rotate-180 opacity-50" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Stats Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-2 gap-6"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                // Updated stat box styling
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm border border-white/10"
                            >
                                <h3 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">
                                    {stat.number}
                                </h3>
                                <p className="text-gray-300">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Right Column: Text Content */}
                    <motion.div
                        variants={textVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {/* Updated text colors */}
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Chosen by{" "}
                            <span className="text-cyan-400">10 million</span>{" "}
                            job applicants around the world
                        </h2>
                        <p className="text-gray-300 mb-4 inline-block">
                            <span className="text-cyan-400">HIREWISE</span> is a
                            modern resume builder that helps you create
                            applications with personality and professionalism.
                            Our tools are trusted by millions-helping at every
                            step of the job hunt, emphasizing your experience,
                            character, value, and skills.
                        </p>
                        <p className="text-gray-300 mb-4 inline-block">
                            We combine flexible, ATS-friendly templates with
                            intuitive tools and tailored content suggestions.
                            The resume builder supports multiple languages and
                            includes everything from drag-and-drop customization
                            to matching cover letters-so job seekers can present
                            a complete, polished story.
                        </p>
                        <p className="text-gray-300">
                            At<span className="text-cyan-400">HIREWISE</span>,
                            we believe the best resumes feel human. That's why
                            we help you personalize your application around your
                            unique experiences-so you stand out, feel confident,
                            and land interviews that align with your goals.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
