import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  unit: String,
  quantity: Number,
  minLevel: Number,
  userId: String, // ✅ ADD THIS
  lastPurchasedDate: Date
});

export default mongoose.model("Item", itemSchema);