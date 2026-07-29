import Stripe from "stripe";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Transaction from "../models/Transaction.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createDepositSession = async (req, res) => {
  const { amount } = req.body;
  const frontend_url = "https://bank-zeta-eight.vercel.app";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "إيداع في الحساب" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontend_url}/verify-deposit?success=true&amount=${amount}`,
      cancel_url: `${frontend_url}/verify-deposit?success=false`,
    });
    res.json({ success: true, session_url: session.url });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export const verifyDeposit = async (req, res) => {
  const { success, amount } = req.body;
  const userId = req.user.id;
  try {
    if (success === "true") {
      const depositAmount = Number(amount);
      const existingTransaction = await Transaction.findOne({
        user: userId,
        type: "deposit",
        amount: depositAmount,
      });
      if (existingTransaction) {
        return res.json({
          success: true,
          message: "تم تسجيل العملية سابقا",
        });
      }

      const user = await User.findById(userId);
      user.balance = (user.balance || 0) + depositAmount;
      await user.save();

      await Transaction.create({
        user: userId,
        type: "deposit",
        amount: depositAmount,
        receiver: user.email,
        date: new Date(),
      });
      await Notification.create({
        user: userId,
        title: "إيداع ناجح 💳",
        message: `تم إيداع ${depositAmount} في حسابك باستخدام Stripe بنجاح`,
      });
      res.json({ success: true, message: "تم الإيداع بنجاح 💰" });
    } else {
      res.json({
        success: false,
        message: "تم إلغاء العملية ❌",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
