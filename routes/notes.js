import express from "express";
import { Note, Tenant } from "../models.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Create Note (respect Free plan limits)
router.post("/", authMiddleware(), async (req, res) => {
  const { title, content } = req.body;
  const { tenantId } = req.user;

  const tenant = await Tenant.findById(tenantId);
  if (tenant.plan === "Free") {
    const count = await Note.countDocuments({ tenantId });
    if (count >= 3) return res.status(403).json({ error: "Free plan limit reached" });
  }

  const note = await Note.create({
    title,
    content,
    tenantId,
    createdBy: req.user.id,
  });

  res.json(note);
});

// Get all notes (tenant scoped)
router.get("/", authMiddleware(), async (req, res) => {
  const notes = await Note.find({ tenantId: req.user.tenantId });
  res.json(notes);
});

// Get specific note
router.get("/:id", authMiddleware(), async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
});

// Update note
router.put("/:id", authMiddleware(), async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.user.tenantId },
    req.body,
    { new: true }
  );
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
});

// Delete note
router.delete("/:id", authMiddleware(), async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    tenantId: req.user.tenantId,
  });
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
});

export default router;
