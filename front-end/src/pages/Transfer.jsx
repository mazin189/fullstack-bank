import { motion } from "framer-motion";
import { Send, Mail, DollarSign } from "lucide-react";
import { useState } from "react";
import axios from "../api/axios.js";

export default function Transfer() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/transfer", {
        receiverEmail: email,
        amount: Number(amount),
      });
      setMsg(data.message);
    } catch (err) {
      setMsg("حدث خطأ أثناء التحويل ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#1a002e] via-[#3a0078] to-[#b48cf2] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl text-white"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto bg-linear-to-tr from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <Send size={36} />
          </div>

          <h2 className="text-3xl font-extrabold mt-4">تحويل الأموال</h2>
          <p className="text-gray-300 mt-2 text-sm">
            قم بإرسال الأموال بسرعة و أمان لأي حساب آخر
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/10 focus-within:border-green-400 transition"
          >
            <Mail className="text-green-300 " />
            <input
              type="email"
              placeholder="البريد الإلكتروني للمستلم"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            />
          </motion.div>

          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/10 focus-within:border-green-400 transition"
          >
            <DollarSign className="text-green-300 " />
            <input
              type="number"
              placeholder="المبلغ المراد تحويله"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
            />
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            disabled={loading}
            onClick={handleTransfer}
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-linear-to-r from-green-400 to-emerald-500 hover:shadow-green-500/40 "}`}
          >
            {loading ? "جار الإرسال..." : "إرسال الآن"}
          </motion.button>
        </div>

        {msg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 text-center font-medium ${msg.includes("❌") ? "text-red-400" : "text-green-400"}`}
          >
            {msg}
          </motion.p>
        )}

        <div className="text-center text-gray-300 text-sm mt-8">
          <p>© 2026 NeoBank - تحويل آمن و سريع</p>
        </div>
      </motion.div>
    </div>
  );
}
