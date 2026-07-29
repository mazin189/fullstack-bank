import { useContext, useEffect, useState } from "react";
import { Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "../api/axios.js";

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const userBalance = user?.balance || 0;
  const cardBalance = user?.card?.balance || 0;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/users/me");
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  const handleTransaction = async (type) => {
    if (!amount || Number(amount) <= 0) return alert("أدخل مبلغ صحيح");
    setLoading(true);

    try {
      let endpoint = "";
      if (type === "deposit") endpoint = "/card-transactions/deposit";
      else if (type === "withdraw") endpoint = "/card-transactions/withdraw";
      else if (type === "to-card") endpoint = "/card-transactions/to-card";
      else if (type === "to-account")
        endpoint = "/card-transactions/to-account";

      const { data } = await axios.post(endpoint, { amount: Number(amount) });

      setUser((prev) => ({
        ...prev,
        balance: data.userBalance ?? prev.balance,
        card: {
          ...prev.card,
          balance: data.cardBalance ?? prev.card?.balance ?? 0,
        },
      }));
      setAmount("");
      alert(data.message);
    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ أثناء العملية");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeDeposit = async () => {
    if (!amount || Number(amount) <= 0) return alert("أدخل مبلغ صحيح");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "/deposit/create",
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success && data.session_url) {
        window.location.href = data.session_url;
      } else {
        alert("حدث خطأ أثناء إنشاء جلسة الدفع ❌");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "فشل الاتصال ب Stripe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a0f1f] via-[#1a237e] to-[#3f51b5] p-6 relative w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full px-10 py-5 pb-8 max-w-3xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl text-white"
      >
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto bg-linear-to-tr from-yellow-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg mb-4">
            <Wallet size={42} />
          </div>

          <h2 className="text-3xl font-extrabold tracking-wide">
            مرحبا {user?.name || "مستخدم"}.
          </h2>
          <p className="text-gray-300 mt-2">إدارة حسابك البنكي بسهولة وأمان</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-7">
          <motion.div className="bg-linear-to-r from-purple-700/60 to-pink-500/50 p-6 rounded-2xl text-center shadow-lg">
            <h3 className="text-lg text-gray-200"> رصيد الحساب 💰</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-300">
              ${userBalance.toFixed(2)}
            </p>
          </motion.div>

          <motion.div className="bg-linear-to-r from-blue-700/60 to-cyan-500/50 p-6 rounded-2xl text-center shadow-lg">
            <h3 className="text-lg text-gray-200"> رصيد البطاقة 💳</h3>
            <p className="text-3xl font-bold mt-2 text-green-300">
              ${cardBalance.toFixed(2)}
            </p>
          </motion.div>
        </div>

        <input
          type="number"
          placeholder="أدخل المبلغ"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-5 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-400 outline-none "
        />

        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-5">
          <button
            onClick={handleStripeDeposit}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition"
          >
            {loading ? "..." : "إيداع عبر Stripe"}
          </button>

          <button
            onClick={() => handleTransaction("withdraw")}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition"
          >
            {loading ? "..." : "سحب الأموال"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => handleTransaction("to-card")}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition"
          >
            {loading ? "..." : "تحويل إلى بطاقة"}
          </button>

          <button
            onClick={() => handleTransaction("to-account")}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition"
          >
            {loading ? "..." : "تحويل إلى الحساب"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
