const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = "secret_key";

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    // attach walletId
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.userId }
    });

    req.walletId = wallet?.id;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
