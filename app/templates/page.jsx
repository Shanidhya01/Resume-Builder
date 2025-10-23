"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { HiSparkles } from "react-icons/hi";

const templates = [
  {
    id: 1,
    title: "Modern",
    image: "/templates/modern.png",
    tags: ["Clean", "Stylish", "Tech Friendly"],
  },
  {
    id: 2,
    title: "Traditional",
    image: "/templates/traditional.png",
    tags: ["Formal", "Corporate", "Classic Look"],
  },
  {
    id: 3,
    title: "Simple",
    image: "/templates/simple.png",
    tags: ["Minimal", "One Page", "Neat Layout"],
  },
  {
    id: 4,
    title: "Creative",
    image: "/templates/creative.png",
    tags: ["Colorful", "Visual", "Unique Design"],
  },
  {
    id: 5,
    title: "ATS Friendly",
    image: "/templates/ats.png",
    tags: ["ATS Optimized", "Readable", "Professional"],
  },
  {
    id: 6,
    title: "Two Column",
    image: "/templates/twocolumn.png",
    tags: ["Compact", "Modern Layout", "Balanced Design"],
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/90">
          <HiSparkles className="w-4 h-4 text-yellow-400" />
          <span>Choose Your Perfect Template</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Pick Your Resume Template
        </motion.h1>
        <p className="text-slate-300 max-w-2xl mx-auto mb-16">
          Explore our collection of modern, traditional, creative, and ATS-friendly resume templates — all 100% free and customizable.
        </p>

        {/* Template Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={template.image}
                  alt={template.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>

              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {template.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {template.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white/10 border border-white/10 text-slate-300 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:scale-105 transition-all duration-300">
                  Preview Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl w-[90%] md:w-[70%] lg:w-[50%] p-6"
            >
              <button
                onClick={() => setSelectedTemplate(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  {selectedTemplate.title} Template
                </h2>
                <div className="relative w-full h-96 mb-6 rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={selectedTemplate.image}
                    alt={selectedTemplate.title}
                    fill
                    className="object-contain bg-slate-800 rounded-xl"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="px-6 py-2 border border-slate-400 text-slate-300 rounded-xl hover:bg-white/10 transition"
                  >
                    Close
                  </button>

                  <Link
                    href={`/editor?template=${selectedTemplate.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
                  >
                    Use This Template
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
}
