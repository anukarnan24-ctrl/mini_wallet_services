const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function UserAndWalletCreation(){
  try{
    const  existingusers = await prisma.user.count();
    console.log(`existing user ${existingusers}`);          
    const noOfUser = 10;
    for (let i=  existingusers+1;i <= existingusers + noOfUser;i++){
      const user = await prisma.user.create({
        data : {
          name: `User${i}`,
          email: `user${i}@gmail.com`,  
          wallet : {
            create : {balance :0}
          }
        },
        include: {wallet : true},
      });
       console.log(`User and wallet created ${user.name}, WalletID: ${user.wallet.id}`);
    }

    }catch(error){
      console.error('Error :',error)
    }finally{
      await prisma.$disconnect();
    }
  }
    UserAndWalletCreation();