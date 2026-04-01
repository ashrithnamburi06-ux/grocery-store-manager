import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  amount: Number,
  userId: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Expense", expenseSchema);