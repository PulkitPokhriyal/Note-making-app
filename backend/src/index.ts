import express from "express";
import bodyparser from "body-parser";
import env from "dotenv";
import jwt from "jsonwebtoken";
import z from "zod";
import bcrypt from "bcrypt";
import cors from "cors";
import nodemailer from "nodemailer";
import { Redis } from "ioredis";
import { PrismaClient } from "@prisma/client";
import { Middleware } from "./middleware.js";

const app = express();
app.use(express.json());
const port = 3000;
const prisma = new PrismaClient();
app.use(bodyparser.json());
app.use(
  cors({
    origin: [
      "https://note-making-app-kappa.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "token"],
    credentials: true,
  }),
);
env.config();
const saltRounds = 10;
const redis = new Redis(process.env.REDIS_URL!);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS_USER,
  },
});
const userSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one capital letter",
    })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
});

app.post("/api/v1/signup", async (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid Input",
      error: result.error,
    });
  }
  const { name, email, password } = result.data;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email already exists",
      });
    } else {
      const hashpassword = await bcrypt.hash(password, saltRounds);
      await redis.set(
        `signup:${email}`,
        JSON.stringify({ name, email, hashpassword }),
        "EX",
        300,
      );
      await redis.set(`otp:${email}`, otp, "EX", 300);

      await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Your OTP Code for signing up on note-making-app",
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      });
      return res.status(200).json({ message: "OTP sent to your email" });
    }
  } catch (e) {
    console.log("Error during signup:", e);
  }
});

app.post("/api/v1/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const storedOtp = await redis.get(`otp:${email}`);
    const userInfo = await redis.get(`signup:${email}`);

    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (!userInfo) {
      return res.status(400).json({ message: "User info not found" });
    }
    const { name, email: userEmail, hashpassword } = JSON.parse(userInfo);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: userEmail,
        password: hashpassword,
      },
    });
    await redis.del(`otp:${email}`);
    await redis.del(`signup:${email}`);
    const token = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.JWT_PASSWORD!,
    );
    res.json({
      token: token,
    });
  } catch (e) {
    console.error("Error during OTP verification", e);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(403).json({ message: "User password is missing" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASSWORD!, {
      expiresIn: "30d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    console.error("Error during login", e);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/v1/notes", Middleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = Number(req.userId);
    if (!title || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/v1/notes", Middleware, async (req, res) => {
  try {
    const userId = Number(req.userId);
    const notes = await prisma.note.findMany({
      where: {
        userId: userId,
      },
    });
    return res.status(200).json({ notes });
  } catch (e) {
    console.error("Error loading notes", e);
    return res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/v1/deletenote/:id", Middleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.userId);
    const deleted = await prisma.note.deleteMany({
      where: { id, userId },
    });
    if (deleted.count === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({
      message: "Note deleted Successfully",
    });
  } catch (e) {
    console.error("Error deleting Note", e);
    return res.status(500).json({ message: "Server Error" });
  }
});
app.get("/api/v1/notes/:id", Middleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.userId);

    const note = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json(note);
  } catch (e) {
    console.error("Error fetching note by ID", e);
    return res.status(500).json({ message: "Server error" });
  }
});
app.put("/api/v1/updatenote/:id", Middleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.userId);
    const { title, content } = req.body;
    const existingNote = await prisma.note.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (!existingNote) {
      return res.status(400).json({ message: "Note not found" });
    }
    const updatedNote = await prisma.note.updateMany({
      where: { id },
      data: {
        title: title || existingNote.title,
        content: content || existingNote.content,
      },
    });
    res.status(200).json({
      message: "Note Updated Successfully",
      note: updatedNote,
    });
  } catch (e) {
    console.error("Error Updating Notes", e);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
