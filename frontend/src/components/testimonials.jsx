"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
    const testimonials = [
        {
            name: "Sarah Johnson",
            rating: 5,
            text: "Excellent website to create a CV. Very easy to use and professionally looking designs.",
            date: "1 day ago",
        },
        {
            name: "Michael Chen",
            rating: 5,
            text: "Very easy to use UI and professionally looking designs. 3 days ago, I landed an interview!",
            date: "3 days ago",
        },
        {
            name: "Emma Davis",
            rating: 5,
            text: "Experience is very good but only 2 months. To land your perfect job, you need to spend more time with the changing needs of the job market, skill needs, and interview tips.",
            date: "5 days ago",
        },
        {
            name: "James Wilson",
            rating: 4,
            text: "Facile d'utilisation, trés à jour et professionnelle.",
            date: "1 week ago",
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Trusted by executives & senior professionals
                    </h2>
                    <p className="text-xl text-gray-600">
                        Chosen by 10 million job applicants around the world
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {testimonial.date}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <span
                                                key={i}
                                                className="text-yellow-400"
                                            >
                                                ★
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-600">{testimonial.text}</p>
                        </motion.div>
                    ))}
                </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <button className="text-black hover:text-cyan-500 font-semibold">Read reviews or leave yours →</button>
        </motion.div>
      </div>
    </section>
  )
}
