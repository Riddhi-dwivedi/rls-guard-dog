"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="max-w-lg w-full bg-gray-900 rounded-3xl shadow-xl p-10 border border-gray-700 text-center">
        <h1 className="text-4xl font-bold mb-6 text-indigo-400">Welcome to School Portal</h1>
        <p className="text-gray-300 mb-8">
          Manage your classes, track student progress, and view school statistics — all in one secure portal.
        </p>

        <div className="flex flex-col gap-4 mb-8">
          <Link
            href="/login"
            className="bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
          >
            Login
          </Link>
        </div>

        <div className="text-left text-gray-400">
          <h2 className="font-semibold mb-2">Features:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Role-based access: Student, Teacher, Head Teacher</li>
            <li>View and edit progress (teachers/head)</li>
            <li>Secure login with Supabase auth</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
