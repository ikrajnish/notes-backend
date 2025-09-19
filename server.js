import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";
import tenantRoutes from "./routes/tenant.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/tenants", tenantRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 5000, () =>
    console.log("Server running on port", process.env.PORT || 5000)
  );
});
