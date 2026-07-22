import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AdminAuthContext);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-0 flex items-center justify-center bg-linear-to-br from-indigo-600 to-purple-700 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-5 md:p-10 rounded-2xl shadow-2xl backdrop-blur-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">لوحة المشرف</h2>
        <input
          className="w-full outline-none mb-4 p-3 rounded bg-white/20 text-white placeholder-gray-300"
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full outline-none mb-4 p-3 rounded bg-white/20 text-white placeholder-gray-300"
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded font-bold transition"
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}
