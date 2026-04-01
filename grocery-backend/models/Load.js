import mongoose from "mongoose";

const loadSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item"
  },
  quantity: Number,
  amount: Number,
  paymentType: String,
   userId: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Load", loadSchema);