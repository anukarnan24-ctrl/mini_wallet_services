const express = require ('express');
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient();
const router  = express.Router();
const auth = require("../middleware/authMiddleware");
router.use(auth);
router.post('/create', async (req,res)=>{
    try{
        const {name,email} = req.body;
        if (!name || !email) {
          return  res.status(400).json({message:"name and email required"})
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const user =  await prisma.user.create({
            data :{
                name,
                email,
            },
        
        });

        const wallet = await prisma.wallet.create({
            data: { 
                userId: user.id,
                balance: 0,
                currency: "INR"
            },

        });

        res.status(201).json({message:"user and wallet are successfully  created",user,wallet});
        console.log("Wallet created:", wallet);

    } catch(error){
        console.error("ERROR:",error);
        res.status(500).json({message:"INTERNAL ERROR"});
    }
});
module.exports  = router;