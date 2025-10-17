"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-[#c9d6ff] to-[#e2e2e2] p-8">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          Choose Your Perfect Resume Template
        </motion.h1>
        <p className="text-gray-600 mb-10">
          Pick from modern, traditional, creative, and ATS-friendly templates — all fully customizable.
        </p>

        {/* Template Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="relative w-full h-64">
                <Image
                  src={template.image}
                  alt={template.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 text-left">
                <h3 className="text-xl font-semibold text-gray-800">
                  {template.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {template.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="mt-5 w-full bg-[#6F42C1] text-white py-2 rounded-xl hover:bg-[#5a32a3] transition">
                  Preview Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl shadow-lg w-[90%] md:w-[70%] lg:w-[50%] p-6 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTemplate(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-black"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  {selectedTemplate.title} Template
                </h2>
                <div className="relative w-full h-96 mb-6">
                  <Image
                    src={selectedTemplate.image}
                    alt={selectedTemplate.title}
                    fill
                    className="object-contain rounded-xl"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="px-6 py-2 border border-gray-400 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                  >
                    Close
                  </button>

                  <Link
                    href={`/editor?template=${selectedTemplate.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-6 py-2 bg-[#6F42C1] text-white rounded-xl hover:bg-[#5a32a3] transition"
                  >
                    Use This Template
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
