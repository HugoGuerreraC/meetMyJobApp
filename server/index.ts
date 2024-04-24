import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";

import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY || "secret";
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post("/api/auth/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as {
      username: string;
      email: string;
      password: string;
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Vérifier les informations d'identification (exemple simple sans vérification réelle)
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Générer le token JWT
    const token = jwt.sign({ email: user.email, id: user.id }, SECRET_KEY);
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
});

// get the user connected
app.get("/api/auth/me", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const decoded = jwt.verify(token, SECRET_KEY) as {
      email: string;
      id: number;
    };
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "An error occurred while getting the user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
