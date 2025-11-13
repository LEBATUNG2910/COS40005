"use client";

import { motion } from "framer-motion";

export default function Footer() {
    const footerSections = [
        {
            title: "Get started",
            links: ["Resume Builder", "Templates", "Pricing", "Privacy Policy"],
        },
        {
            title: "Resume",
            links: [
                "Resume Templates",
                "Resume Examples",
                "Resume Guide",
                "Resume Samples",
            ],
        },
        {
            title: "Cover Letter",
            links: [
                "Cover Letter Templates",
                "Cover Letter Guide",
                "Cover Letter Examples",
            ],
        },
        {
            title: "Resources",
            links: [
                "Career Guide",
                "Job Search Tips",
                "Interview Preparation",
                "Networking Tips",
            ],
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
    };

    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
                >
                    {footerSections.map((section, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <h4 className="font-semibold mb-4">
                                {section.title}
                            </h4>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-white transition"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="pt-8 border-t border-gray-800 text-center text-gray-400"
                >
                    <p>
                        &copy; 2025 HISEWISE. All rights reserved. | Terms of
                        Service | Privacy Policy
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
