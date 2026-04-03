import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: String,
  phone: String,
  userId: String,
});

export default mongoose.model("Supplier", supplierSchema);