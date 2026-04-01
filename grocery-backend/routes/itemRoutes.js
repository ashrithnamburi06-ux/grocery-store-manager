import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD item
router.post("/", async (req, res) => {
  try {
    const { name, unit, quantity, minLevel } = req.body;

    const newItem = new Item({
      name,
      unit,
      quantity,
      minLevel,
      userId
    });

    await newItem.save();

    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const items = await Item.find({ userId });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;