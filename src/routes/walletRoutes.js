
const express = require ('express');
const {PrismaClient} = require ('@prisma/client');
const prisma = new PrismaClient();
const router  = express.Router();

const auth = require("../middleware/authMiddleware");
router.use(auth);
 router.get ('/', async (req, res)=>{

    try{
        const userId = req.userId;
    if(!userId){
        return res.status(400).json({ message: "userId MISSING FORM TOKEN" });
    } 


    let wallet = await prisma.wallet.findUnique({
        where:{userId: userId}
    })

    if(!wallet){
    return res.status(400).json({ message: "No wallet found for this user" });
    }
   

    return res.status(200).json(wallet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;