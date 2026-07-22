import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Wallet, CreditCard, Dot } from "lucide-react";
import {AuthContext} from "../context/AuthContext.jsx"
import axios from "../api/axios.js"

export default function Profile() {


  const {user} = useContext(AuthContext)
  const [card, setCard] = useState(null)
  const [flipped, setFlipped] = useState(false);
  const [editName, setEditName] = useState(user?.name);
  const [editEmail, setEditEmail] = useState(user?.email);
  const [saved, setSaved] = useState(false);



  const getCard = async () => {
    try{
    const {data} = await axios.get("/card")
    setCard(data.card)
    }catch(err){
    setCard(null)
    }
  }


  useEffect(()=>{
    getCard()
  },[])



  const formatCardNumber = (num) => {
  if(!num) return "---- ---- ---- ----"
  return num.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim()
}



  const handleSubmit = async (e) => {
  e.preventDefault()
  try{
   const token = localStorage.getItem("token")
   const res = await axios.put(
    "/users/update", 
    {name: editName, email: editEmail},
    {headers: {
      Authorization: `Bearer ${token}`
    }}
   )
   setSaved(true)
   setTimeout(()=> setSaved(false), 2000)
   alert(res.data.message || "")
  }catch(err){
  alert(err.response?.data?.message || "")
  }
  } 


  const totalBalance = (user?.balance || 0) + (card?.balance || 0)


  return (
    <div className="pt-24 min-h-screen w-full bg-linear-to-br from-[#0a0f1f] via-[#101a3a] to-[#1a237e] flex flex-col items-center justify-center text-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5, scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-200 h-200 bg-purple-600/20 rounded-full blur-3xl -top-50 -left-50"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4, scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-175 h-175 bg-blue-600/20 rounded-full blur-3xl -top-50 -left-50"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-wide">
          الملف الشخصي البنكي 🏦
        </h1>

        <p className="text-gray-400 text-sm md:text-base">
          مرحبا {user?.name || "بك"} في نظام NeoBank
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative perspective mb-8"
      >
        <motion.div
          onClick={() => setFlipped((s) => !s)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7 }}
          style={{ transformStyle: "preserve-3d" }}
          className="cursor-pointer w-[320px] md:w-100 h-55 md:h-65"
        >
          <div
            className="absolute top-0 left-0 w-full h-full rounded-2xl p-5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-2xl text-white"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            <div className="flex justify-between items-start mb-5">
              <div className="text-xs md:text-sm ">
                NeoBank <Dot /> VISA
              </div>

              <div className="text-right text-xs">
                <div className="text-white/70">صلاحية</div>
                <div className="font-semibold">
                  {card?.expiryDate ?? "--/--"}
                </div>
              </div>
            </div>

            <div className="text-xl md:text-2xl font-mono tracking-widest">
              {formatCardNumber(card?.cardNumber)}
            </div>

            <div className="mt-6 flex justify-between text-sm">
              <div>
                <div className="text-white/70">المستخدم</div>
                <div className="font-semibold">{user?.name || "مستخدم"}</div>
              </div>

              <div className="text-right">
                <div className="text-white/70">الرصيد</div>
                <div className="font-bold text-lg">
                  ${card?.balance?.toFixed(2) ?? "0.00"}
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute top-0 left-0 w-full h-full rounded-2xl p-5 bg-linear-to-r from-gray-200 to-gray-300 text-gray-800"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="h-8 bg-black/80 mb-4 rounded-sm" />
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-xs mb-1">CVV</div>
                <div className="bg-white py-1 px-3 rounded-md font-mono">
                  {card?.cvv ?? "*"}
                </div>
              </div>

              <div className="text-xs text-right">
                <div>انتهاء</div>
                <div className="font-semibold">
                  {card?.expiryDate ?? "--/--"}
                </div>
              </div>
            </div>

            <div className="text-xs leading-relaxed">
              لا تشارك معلومات البطاقة مع أي أحد.
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl w-[90%] max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-200">
          <div className="flex items-center gap-3">
            <User className="text-purple-400" />

            <div>
              <p className="text-sm text-gray-400">الاسم الكامل</p>
              <p className="text-base font-semibold">
                {user?.name || "غير متوفر"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-blue-400" />

            <div>
              <p className="text-sm text-gray-400">البريد الإلكتروني</p>
              <p className="text-base font-semibold">
                {user?.email || "غير متوفر"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Wallet className="text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">الرصيد الكلي</p>
              <p className="text-lg font-bold text-yellow-300">
                ${totalBalance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="text-pink-400" />

            <div>
              <p className="text-sm text-gray-400">رقم البطاقة</p>
              <p className="text-base font-semibold">
                {card?.cardNumber?.slice(0, 4) ?? "----"} * *{" "}
                {card?.cardNumber?.slice(0, 4) ?? "----"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>





<motion.div
initial={{opacity:0, y:40}}
animate={{opacity:1, y:0}}
transition={{duration:1}}
className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-xl text-gray-200 w-[90%] max-w-3xl"
>



<h3 className="text-xl font-bold mb-4 text-center text-white">
تعديل الملف الشخصي ✏️
</h3>


<form onSubmit={handleSubmit} className="flex flex-col gap-4">
<div>
  <label className="text-gray-400 text-sm">الاسم</label>
  <input type="text" value={editName} onChange={(e)=> setEditName(e.target.value)} className="w-full mt-1 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none"/>
</div>


<div>
  <label className="text-sm text-gray-400">البريد الإلكتروني</label>
  <input type="email" value={editEmail} onChange={(e)=> setEditEmail(e.target.value)} className="w-full mt-1 p-2 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none"/>
</div>



<button type="submit" className="mt-4 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition">
حفظ التعديلات
</button>



</form>



{saved && (
  <p className="text-center text-green-400 mt-4">
  تم حفظ التعديلات بنجاح ✅
  </p>
)}
</motion.div>


<p className="mt-10 mb-3 text-gray-400 text-sm">
© 2026 NeoBank - جميع الحقوق محفوظة
</p>





    </div>
  );
}
