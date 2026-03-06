import { motion } from "framer-motion";

import pic2 from "../assets/pic2.jpg";

function AISection() {
    const features = [
        {
            title: "AI content generation",
            description: "Leverage AI to create compelling resume content",
        },
        {
            title: "AI resume grading",
            description: "Get instant feedback on your resume quality",
        },
        {
            title: "AI skills builder",
            description: "Improve your skills with AI-powered suggestions",
        },
    ];

    return (
        <section className="relative py-20 bg-gradient-to-r from-blue-900 to-black overflow-hidden">
            <div className="absolute inset-0 opacity-30">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-700 opacity-20 blur-3xl"
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Fully equipped for the age of AI
                    </h2>
                    <p className="text-xl text-gray-300">
                        Your AI-powered resume builder for the modern job seeker
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="grid md:grid-cols-2 gap-8 items-center"
                >
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.6,
                                }}
                                // Giảm padding từ p-1 xuống p-[1px] để viền mỏng hơn
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 p-[1px] rounded-lg"
                            >
                                <div className="bg-blue-950 p-4 rounded-md">
                                    <h4 className="text-white font-semibold mb-1">
                                        {feature.title}
                                    </h4>
                                    <p className="text-gray-300 text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Giảm padding từ p-1 xuống p-[1px] để viền mỏng hơn */}
                        <div className="relative bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px] rounded-2xl shadow-2xl">
                            <div className="bg-blue-950 rounded-2xl overflow-hidden p-6">
                                <div className="bg-gradient-to-br from-cyan-300 to-blue-500 rounded-lg h-64 flex items-center justify-center">
                                    <img
                                        src={pic2}
                                        alt="AI Features"
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mt-12"
                >
                    <motion.button
                        className="bg-gradient-to-r from-cyan-500 to-blue-900 hover:from-cyan-400 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300"
                    >
                        Explore AI Features →
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}

export default AISection;