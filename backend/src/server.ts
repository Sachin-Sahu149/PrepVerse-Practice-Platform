import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma"; // your prisma client
import cors from "cors"

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

/**
 * POST /users
 * Create a new user with an optional post
 */
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, postTitle, postContent } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        posts: postTitle
          ? {
              create: {
                title: postTitle,
                content: postContent || "",
                published: true,
              },
            }
          : undefined,
      },
      include: { posts: true },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

/**
 * GET /users
 * Fetch all users with their posts
 */
app.get("/users", async (_req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: { posts: true },
    });
    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * GET /users/:id
 * Fetch a single user by ID with posts
 */
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { posts: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});