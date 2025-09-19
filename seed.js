import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User, Tenant } from "./models.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear old data
  await User.deleteMany({});
  await Tenant.deleteMany({});

  // Create tenants
  const acme = await Tenant.create({ name: "Acme", slug: "acme", plan: "Free" });
  const globex = await Tenant.create({ name: "Globex", slug: "globex", plan: "Free" });

  // Password hashing
  const hashed = await bcrypt.hash("password", 10);

  // Create users
  await User.create([
    { email: "admin@acme.test", password: hashed, role: "Admin", tenantId: acme._id },
    { email: "user@acme.test", password: hashed, role: "Member", tenantId: acme._id },
    { email: "admin@globex.test", password: hashed, role: "Admin", tenantId: globex._id },
    { email: "user@globex.test", password: hashed, role: "Member", tenantId: globex._id },
  ]);

  console.log("Seed complete ✅");
  process.exit();
};

seed();
