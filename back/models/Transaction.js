import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: [
      "deposit",
      "withdraw",
      "transfer",
      "receive",
      "deposit-card",
      "withdraw-to-card",
      "transfer-to-card",
      "transfer-to-account",
    ],
    required: true,
  },
  amount: {
    required: true,
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  receiver: {
    type: String,
  },
});

const transactionModel = mongoose.model("Transaction", transactionSchema);

export default transactionModel;
