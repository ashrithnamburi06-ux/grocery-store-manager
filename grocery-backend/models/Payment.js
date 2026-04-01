
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  supplierId: mongoose.Schema.Types.ObjectId,
  amountPaid: Number,
  userId: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", paymentSchema);