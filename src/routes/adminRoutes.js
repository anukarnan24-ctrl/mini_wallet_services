const express = require("express");
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");


router.use(auth);
router.use(adminOnly);
//1.s
//todo use transactionEnabled column to update user status
router.patch('/users/:id/status',async(req,res)=>{
try{
    const userId = req.params.id;
    const {active} = req.body;
  
    if(active == undefined) 
        return res.status(400).json({message:"active is required (true/false)"});

    const settings= await prisma.settings.update({
            where : {userId},
            data : {active},
    });
       res.json({message:active? "User Enabled":"User Disabled",settings});

}catch(err){
    console.error(err);
    res.status(500).json({message:"internal service error"});
}
})

//2.L
router.patch("/users/:id/limit",async(req,res)=> {
    try{
        const userId = req.params.id;
        let {limit} = req.body;

        if(limit == undefined){
            return res.status(400).json({message:"limit is required"})
        }
       if (limit === null) {
       limit = 200000;  
    }
    if (limit < 0) {
      return res.status(400).json({ message: "Limit cannot be negative" });
    }
    const settings =await prisma.settings.update({
        where :{userId},
        data :{limit},
    });
    res.json({message: limit === 200000 ? "Limit reset to default (2L)" : "Limit updated",settings})

    }catch(err){
        console.log(err);
        res.status(500).json({message:"INTERNAL ERROR"})
    }
});
//3.t
router.get("/transactions", async(req,res)=> {
    try{
        const {userId,type,status} = req.query;
        let where= {};
     if(userId){
        where.wallet = {userId};
    }
    if(type){
        where.type=type;
    }
    if (status){
        where.status=status;

    }
    const transaction =  await prisma.transaction.findMany({
        where,
        include:{
          wallet: {
            select: { userId: true }
          }
        },
        orderBy:{createdAt:"desc"}
    });
    res.json({count:transaction.length,transaction});
}catch(err){
    console.error("ERROR",err);
    return res.status(500).json({message:"INTERNAL SERVER ERROR"});
}
});

//4
router.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: {
        id: true,
        balance: true,
        currency: true
      }
    });
    const settings = await prisma.settings.findUnique({
      where: { userId }
    });
    const creditSum = await prisma.transaction.aggregate({
      where: { walletId: wallet?.id, type: "CREDIT" },
      _sum: { amount: true }
    });

    const debitSum = await prisma.transaction.aggregate({
      where: { walletId: wallet?.id, type: "DEBIT" },
      _sum: { amount: true }
    });

    const txnCount = await prisma.transaction.count({
      where: { walletId: wallet?.id }
    });

    const summary = {
      totalCredit: creditSum._sum.amount || 0,
      totalDebit: debitSum._sum.amount || 0,
      transactionCount: txnCount
    };

    const transactions = await prisma.transaction.findMany({
      where: { walletId: wallet?.id },
      orderBy: { createdAt: "desc" }
    });
    res.json({
      message: "User details fetched",
      user,
      wallet,
      settings,
      summary,
      transactions
    });

  } catch (err) {
    console.error("Admin User Details Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.settings.count({
      where: { active: true }
    });
    const disabledUsers = await prisma.settings.count({
      where: { active: false }
    });
    const totalWallets = await prisma.wallet.count();
    const totalTransactions = await prisma.transaction.count();
    const creditSum = await prisma.transaction.aggregate({
      where: { type: "CREDIT" },
      _sum: { amount: true }
    });
    const debitSum = await prisma.transaction.aggregate({
      where: { type: "DEBIT" },
      _sum: { amount: true }
    });

    res.json({
      message: "Admin dashboard summary",
      users: {
        total: totalUsers,
        active: activeUsers,
        disabled: disabledUsers
      },
      wallets: {
        total: totalWallets
      },
      transactions: {
        total: totalTransactions,
        totalCredit: creditSum._sum.amount || 0,
        totalDebit: debitSum._sum.amount || 0
      }
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;