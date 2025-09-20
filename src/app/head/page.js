"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function HeadPage() {
  const router = useRouter();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("progress")
          .select("student_id, class_id, subject, marks, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setProgress(data || []);
      } catch (err) {
        console.error("Error fetching progress:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
        <span className="ml-3 text-indigo-400 text-lg">Loading progress...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400 flex items-center gap-2">
        🏫 School Progress Overview
      </h1>

      {progress.length === 0 ? (
        <p className="text-gray-400">No records yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-xl border border-gray-700 text-left">
            <thead className="bg-gray-700 uppercase text-gray-300">
              <tr>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Class ID</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((p, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3">{p.student_id}</td>
                  <td className="px-4 py-3">{p.class_id}</td>
                  <td className="px-4 py-3">{p.subject}</td>
                  <td className="px-4 py-3">{p.marks}</td>
                  <td className="px-4 py-3">
                    {new Date(p.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
