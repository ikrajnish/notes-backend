import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// =============================
// Login
// =============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("tenantId");
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId._id,
      tenantSlug: user.tenantId.slug,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

// =============================
// Invite User (Admin only)
// =============================
router.post("/invite", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: "Email and role are required" });
    }

    // Prevent duplicate emails
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Default password for invited users
    const defaultPassword = "password";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      tenantId: req.user.tenantId, // same tenant as Admin
    });

    res.json({
      message: "User invited successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to invite user" });
  }
});

export default router;
