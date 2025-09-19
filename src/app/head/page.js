"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function HeadPage() {
  const router = useRouter();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("progress")
        .select("student_id, class_id, subject, marks, created_at");

      if (error) console.error(error);
      else setProgress(data);

      setLoading(false);
    };
    loadData();
  }, [router]);

  if (loading) return <p className="text-center text-gray-400 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">🏫 School Progress Overview</h1>
      {progress.length === 0 ? (
        <p className="text-gray-400">No records yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-xl border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2">Student ID</th>
                <th className="px-4 py-2">Class ID</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Marks</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((p, idx) => (
                <tr key={idx} className="border-t border-gray-700">
                  <td className="px-4 py-2">{p.student_id}</td>
                  <td className="px-4 py-2">{p.class_id}</td>
                  <td className="px-4 py-2">{p.subject}</td>
                  <td className="px-4 py-2">{p.marks}</td>
                  <td className="px-4 py-2">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
