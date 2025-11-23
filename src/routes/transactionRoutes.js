
const express = require("express");
const { PrismaClient, TransactionStatus } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();
const auth = require("../middleware/authMiddleware");
router.use(auth);

router.post("/", async (req, res) => {
  try {
    const { type, amount } = req.body;

    if (!type || !amount) {
      return res.status(400).json({ message: "type and amount are required" });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { id: req.walletId }
    });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    
    const settings = await prisma.settings.findUnique({
      where: { userId: wallet.userId }
    });

    if (!settings) {
      return res.status(400).json({ message: "Settings not found for this user" });
    }

   
    if (!settings.active) {
      return res.status(403).json({
        message: "User disabled by admin. Transaction blocked."
      });
    }

  
    const fees = 5;
    let newBalance = wallet.balance;

    
    if (type === "CREDIT") {
      newBalance += amount;
    }


    else if (type === "DEBIT") {

     
      const debitSummary = await prisma.transaction.aggregate({
        where: { walletId: wallet.id, type: "DEBIT" },
        _sum: { amount: true }
      });

      const used = debitSummary._sum.amount || 0;
      const newTotal = used + amount;

      if (newTotal > settings.limit) {
        return res.status(400).json({
          message: "Debit limit exceeded",
          limit: settings.limit,
          used: used,
          remaining: settings.limit - used
        });
      }


      if (wallet.balance < amount + fees) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      newBalance -= (amount + fees);
    }

    else {
      return res.status(400).json({ message: "Invalid type" });
    }

    
    // ct
    const transaction = await prisma.transaction.create({
      data: {
        walletId: req.walletId,
        type,
        amount,
        fees,
        status: "SUCCESS"
      }
    });

    await prisma.wallet.update({
      where: { id: req.walletId },
      data: { balance: newBalance }
    });

    res.status(201).json({
      message: "Transaction successful",
      transaction,
      newBalance
    });

  } catch (error) {
    console.error("Transaction Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports  = router;