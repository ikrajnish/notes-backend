import express from "express";
import { Tenant } from "../models.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Upgrade tenant to Pro (Admin only)
router.post("/:slug/upgrade", authMiddleware(["Admin"]), async (req, res) => {
  const tenant = await Tenant.findOneAndUpdate(
    { slug: req.params.slug },
    { plan: "Pro" },
    { new: true }
  );
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  res.json(tenant);
});

export default router;
