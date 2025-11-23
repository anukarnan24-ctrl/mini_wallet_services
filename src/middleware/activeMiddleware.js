function checkActive(req, res, next) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: "Your account is inactive" });
  }

  next();
}

module.exports = { checkActive };
