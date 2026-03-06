import { motion } from "framer-motion";
import pic4 from "../assets/pic4.png";
import { Lock, FileText, CheckCircle } from "lucide-react";

function ATSSection() {
    const features = [
        { icon: Lock, title: "Readable contact information" },
        { icon: FileText, title: "Full experience section planning" },
        { icon: CheckCircle, title: "Optimized skills section" },
    ];

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-r from-blue-900 to-black py-12 md:py-20">
            {/* Background Decorations */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 30%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 30%)",
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* LEFT SECTION - TEXT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 md:order-1"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                            Resumes optimized for{" "}
                            <span className="text-cyan-400 block sm:inline">
                                Applicant Tracking Systems (ATS)
                            </span>
                        </h2>

                        <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                            Every template has been expertly reviewed by
                            Certified Professional Resume Writers to ensure it's
                            not only ATS-proof but recruiter-friendly.
                        </p>

                        <div className="grid gap-4 mb-10">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                                            <Icon size={20} />
                                        </div>
                                        <span className="text-white font-medium">
                                            {feature.title}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <button className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25">
                            Build an ATS-Friendly Resume
                        </button>
                    </motion.div>

                    {/* RIGHT SECTION - IMAGE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative order-1 md:order-2"
                    >
                        {/* Decorative glow behind image */}
                        <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-3xl opacity-50" />
                        
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                {/* Removed fixed h-96, used aspect-ratio instead */}
                                <div className="aspect-[4/3] md:aspect-auto">
                                    <img
                                        src={pic4}
                                        alt="ATS Check Visualization"
                                        className="w-full h-auto object-contain md:object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

export default ATSSection;