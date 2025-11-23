const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = "secret_key";

// REGISTER
router.post("/register", async (req, res) => {
  console.log("/register route hit");

  try {
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const userRole = role === "ADMIN" ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: userRole,
        wallet: { create: { balance: 0, currency: "INR" } },
        settings: { create: {} }
      }
    });

    console.log("User created:", user);

    res.json({ message: "Registered", userId: user.id });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
