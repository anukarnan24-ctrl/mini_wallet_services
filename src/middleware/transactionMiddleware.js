function checkTransactionEnabled(req, res, next) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (user.role === "user" && !user.transactionEnabled) {
    return res.status(403).json({ message: "Transactions are disabled for your account" });
  }

  next();
}

module.exports = { checkTransactionEnabled };
