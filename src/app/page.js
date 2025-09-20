"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, ShieldCheck, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full text-center"
      >
        {/* Glass card */}
        <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-2xl p-10">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4"
          >
            Welcome to School Portal
          </motion.h1>
          <p className="text-lg text-gray-300 mb-10">
            A modern way to manage classrooms, track progress, and empower both teachers and students.
          </p>

          {/* Call to Action */}
          <div className="flex justify-center mb-12">
            <Link
              href="/login"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-8 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Features Section */}
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-gray-800/70 border border-gray-700"
            >
              <Users className="w-8 h-8 text-indigo-400 mb-3" />
              <h3 className="font-semibold text-gray-200">Role-based Access</h3>
              <p className="text-sm text-gray-400 mt-2">
                Student, Teacher, Head Teacher — each role gets the right access.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-gray-800/70 border border-gray-700"
            >
              <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-semibold text-gray-200">Track Progress</h3>
              <p className="text-sm text-gray-400 mt-2">
                Teachers can manage grades, students can see their growth.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-gray-800/70 border border-gray-700"
            >
              <ShieldCheck className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-semibold text-gray-200">Secure Login</h3>
              <p className="text-sm text-gray-400 mt-2">
                Powered by Supabase Auth with enterprise-grade security.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
