import { motion } from "framer-motion"
import pic4 from '../assets/pic4.jpg'

function ATSSection() {
  const features = [
    { icon: "🔒", title: "Readable contact information" },
    { icon: "📝", title: "Full experience section planning" },
    { icon: "✓", title: "Optimized skills section" },
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-r from-blue-900 to-black">
      <div className="absolute inset-0 opacity-10">
        {/* Using a placeholder background, update with your /abstract-geometric-flow.png if needed */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 30%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 30%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Resumes optimized for Applicant Tracking Systems (ATS)
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Every template has been expertly reviewed by Certified
              Professional Resume Writers to ensure it's not only ATS-proof but
              recruiter-friendly.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-white font-semibold">
                    {feature.title}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Build an ATS-Friendly Resume
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
            style={{ perspective: "1000px" }} // Add perspective for 3D rotate
          >
            <div className="relative z-10 bg-gradient-to-br from-cyan-400 to-purple-600 p-1 rounded-2xl shadow-2xl">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden">
                <div className="relative h-96 bg-gradient-to-br from-cyan-200 to-purple-200">
                  <img
                    src={pic4}
                    alt="ATS Check"
                    className="object-cover w-full h-full"
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