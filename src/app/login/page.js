"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({ email, password });

        if (loginError) throw loginError;

        const user = loginData.user;
        if (!user) throw new Error("Login failed: no user found");

        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleError || !roleData) throw new Error("No role assigned. Contact admin.");

        const role = roleData.role;
        if (role === "student") router.push("/student");
        else if (role === "teacher") router.push("/teacher");
        else if (role === "head_teacher") router.push("/head");
        else throw new Error("Unknown role: " + role);

      } else {
        const { data: signupData, error: signupError } =
          await supabase.auth.signUp({ email, password });

        if (signupError) throw signupError;

        const user = signupData.user;
        if (!user) {
          setMsg("Signup OK — check your email to confirm, then login.");
          setIsLogin(true);
          return;
        }

        const { error: roleError } = await supabase
          .from("roles")
          .insert([{ user_id: user.id, role: "student", class_id: null }]);

        if (roleError) throw new Error("Role insert failed: " + roleError.message);

        setMsg("Signup complete! You are registered as 'student'. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-3xl shadow-xl p-10 border border-gray-700">
        <h2 className="text-4xl font-bold mb-8 text-center text-indigo-400">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {msg && (
          <p className="text-red-500 text-center mb-6">{msg}</p>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setMsg(""); }}
            className="text-indigo-400 font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
