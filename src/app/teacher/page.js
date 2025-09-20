"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TeacherPage() {
  const router = useRouter();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newMarks, setNewMarks] = useState("");

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
          .select("id, student_id, subject, marks, created_at")
          .order("created_at", { ascending: true });

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

  const handleEdit = (id, marks) => {
    setEditingId(id);
    setNewMarks(marks);
  };

  const handleSave = async (id) => {
    const marksValue = parseInt(newMarks, 10);
    if (isNaN(marksValue)) {
      alert("Please enter a valid number");
      return;
    }

    try {
      const { error } = await supabase
        .from("progress")
        .update({ marks: marksValue })
        .eq("id", id);

      if (error) throw error;

      setProgress(progress.map(p => p.id === id ? { ...p, marks: marksValue } : p));
      setEditingId(null);
    } catch (err) {
      console.error("Update failed:", err.message);
      alert("Failed to update marks");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
        <span className="ml-3 text-indigo-400 text-lg">Loading progress...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400 flex items-center gap-2">👩‍🏫 Edit Class Progress</h1>

      {progress.length === 0 ? (
        <p className="text-gray-400">No records yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-xl border border-gray-700 text-left">
            <thead className="bg-gray-700 uppercase text-gray-300">
              <tr>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((p) => (
                <tr key={p.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                  <td className="px-4 py-3">{p.student_id}</td>
                  <td className="px-4 py-3">{p.subject}</td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <input
                        type="number"
                        value={newMarks}
                        onChange={(e) => setNewMarks(e.target.value)}
                        className="w-16 text-black p-1 rounded"
                      />
                    ) : (
                      p.marks
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {editingId === p.id ? (
                      <button
                        onClick={() => handleSave(p.id)}
                        className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 transition"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(p.id, p.marks)}
                        className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500 transition"
                      >
                        Edit
                      </button>
                    )}
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
