import mongoose from "mongoose";

/* ==========================
   Tenant Schema
========================== */
const tenantSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  plan: { type: String, enum: ["Free", "Pro"], default: "Free" },
});

/* ==========================
   User Schema
========================== */
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Admin", "Member"], default: "Member" },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
});

/* ==========================
   Note Schema
========================== */
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Export all models
export const Tenant = mongoose.model("Tenant", tenantSchema);
export const User = mongoose.model("User", userSchema);
export const Note = mongoose.model("Note", noteSchema);
