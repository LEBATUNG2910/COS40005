"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for students and first-time job seekers.",
    cta: "Start Free",
    path: "/auth",
    features: [
      "1 resume template",
      "Basic ATS check",
      "Standard download",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    popular: true,
    description: "Best for active applicants who want faster results.",
    cta: "Go Pro",
    path: "/process",
    features: [
      "All premium templates",
      "Advanced ATS optimization",
      "AI resume suggestions",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$79",
    period: "/month",
    description: "Great for coaches, campus teams, and organizations.",
    cta: "Contact Sales",
    path: "/organize",
    features: [
      "Up to 20 members",
      "Shared template library",
      "Usage analytics",
      "Dedicated onboarding",
    ],
  },
];

function PricingPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 opacity-25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-4xl md:text-5xl font-bold text-gray-900"
          >
            Simple pricing for every
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              {" "}
              career stage
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-4 text-gray-600 max-w-2xl mx-auto"
          >
            Choose a plan that fits your goals, from your first resume to
            high-volume career support.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className={`rounded-2xl border p-6 shadow-sm ${
                plan.popular
                  ? "border-cyan-400 bg-cyan-50/40"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.popular && (
                <span className="inline-flex text-xs font-semibold bg-cyan-500 text-white px-2.5 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="mt-3 text-2xl font-bold text-gray-900">
                {plan.name}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">{plan.description}</p>

              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-gray-500 pb-1">{plan.period}</span>
                )}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <Check className="w-4 h-4 text-cyan-500 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={plan.path}>
                <button
                  className={`mt-7 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    plan.popular
                      ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Need a custom enterprise package?
          </h2>
          <p className="mt-2 text-gray-600">
            We support universities, recruiting teams, and coaching businesses
            with tailored onboarding.
          </p>
          <Link to="/organize">
            <button className="mt-5 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition">
              Talk to Sales
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default PricingPage;
