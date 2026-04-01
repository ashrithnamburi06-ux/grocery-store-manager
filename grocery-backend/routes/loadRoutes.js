import express from "express";
import Load from "../models/Load.js";
import Item from "../models/Item.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { itemId, quantity, amount, paymentType } = req.body;

    // Validate
    if (!itemId || !quantity) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // 1. Find item
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // 2. Save load
    const newLoad = new Load({
      itemId,
      quantity,
      amount,
      paymentType
    });

    await newLoad.save();

    // 3. Update stock
    item.quantity += quantity;
    item.lastPurchasedDate = new Date();

    await item.save();

    res.json({
      message: "Load added & stock updated",
      updatedQuantity: item.quantity
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;