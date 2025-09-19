"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function TeacherPage() {
  const router = useRouter();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newMarks, setNewMarks] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("progress")
        .select("id, student_id, subject, marks")
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      else setProgress(data);

      setLoading(false);
    };
    loadData();
  }, [router]);

  const handleEdit = (id, marks) => {
    setEditingId(id);
    setNewMarks(marks);
  };

  const handleSave = async (id) => {
    const { error } = await supabase
      .from("progress")
      .update({ marks: parseInt(newMarks) })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to update marks");
    } else {
      setProgress(progress.map(p => p.id === id ? { ...p, marks: parseInt(newMarks) } : p));
      setEditingId(null);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">👩‍🏫 Edit Class Progress</h1>
      {progress.length === 0 ? <p className="text-gray-400">No records yet.</p> : (
        <table className="min-w-full bg-gray-800 rounded-xl border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">Student ID</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Marks</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((p) => (
              <tr key={p.id} className="border-t border-gray-700">
                <td className="px-4 py-2">{p.student_id}</td>
                <td className="px-4 py-2">{p.subject}</td>
                <td className="px-4 py-2">
                  {editingId === p.id ? (
                    <input
                      type="number"
                      value={newMarks}
                      onChange={(e) => setNewMarks(e.target.value)}
                      className="w-16 text-black p-1 rounded"
                    />
                  ) : p.marks}
                </td>
                <td className="px-4 py-2">
                  {editingId === p.id ? (
                    <button
                      onClick={() => handleSave(p.id)}
                      className="bg-green-600 px-3 py-1 rounded hover:bg-green-500"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(p.id, p.marks)}
                      className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
