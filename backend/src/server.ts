import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma"; // your prisma client
import dotenv from "dotenv";
import cors from "cors"

const app = express();

dotenv.config();
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});