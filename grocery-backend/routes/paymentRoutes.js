import express from "express";
import Payment from "../models/Payment.js";
import Load from "../models/Load.js";

const router = express.Router();

// ➤ ADD PAYMENT
router.post("/", async (req, res) => {
  try {
    const { supplierId, amountPaid } = req.body;

    const payment = new Payment({
      supplierId,
      amountPaid
    });

    await payment.save();

    res.json({
      message: "Payment added successfully",
      payment
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ➤ GET SUPPLIER BALANCE
router.get("/:supplierId", async (req, res) => {
  try {
    const { supplierId } = req.params;

    // total credit (from loads)
    const loads = await Load.find({
      supplierId,
      paymentType: "credit"
    });

    const totalCredit = loads.reduce((sum, l) => sum + l.amount, 0);

    // total paid
    const payments = await Payment.find({ supplierId });

    const totalPaid = payments.reduce(
      (sum, p) => sum + p.amountPaid,
      0
    );

    const remaining = totalCredit - totalPaid;

    res.json({
      totalCredit,
      totalPaid,
      remaining
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;