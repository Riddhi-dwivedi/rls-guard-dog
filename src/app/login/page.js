"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-700"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-8"
        >
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
        </motion.h2>

        {msg && (
          <div className="mb-6 text-center text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-lg py-2 px-3">
            {msg}
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-4 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-4 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMsg("");
            }}
            className="text-indigo-400 font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
