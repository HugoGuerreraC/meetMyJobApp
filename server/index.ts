import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import path from "path";

import { randomUUID } from "crypto";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as Minio from "minio";

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY || "secret";
const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "access-key",
  secretKey: process.env.MINIO_SECRET_KEY || "secret",
});

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
    const { username, password } = req.body;
    // Vérifier les informations d'identification (exemple simple sans vérification réelle)
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Générer le token JWT
    const token = jwt.sign(
      { username: user.username, id: user.id },
      SECRET_KEY
    );
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
      username: string;
      id: number;
    };
    const user = await prisma.user.findFirst({
      where: { email: decoded.username },
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
app.get("/api/job-offers", async (req: Request, res: Response) => {
  try {
    const jobOffers = await prisma.jobOffer.findMany({
      where: {
        OR: [
          {
            title: {
              contains: (req.query.search as string) || "",
            },
          },
          {
            description: {
              contains: (req.query.search as string) || "",
            },
          },
          {
            companyName: {
              contains: (req.query.search as string) || "",
            },
          },
        ],
      },
    });

    const jobOffersWithImages = await Promise.all(
      jobOffers.map(async (jobOffer) => {
        const [logo, image] = await Promise.all([
          getMinioObjectUrl("meetmyjob", jobOffer.logoMinioId),
          getMinioObjectUrl("meetmyjob", jobOffer.imageMinioId),
        ]);

        // Return the job offer with the logo and image
        return {
          ...jobOffer,
          logoUrl: logo,
          imageUrl: image,
        };
      })
    );

    res.json(jobOffersWithImages);
  } catch (error) {
    console.error("Error getting job offers:", error);
    res
      .status(500)
      .json({ error: "An error occurred while getting the job offers" });
  }
});
async function getMinioObjectUrl(bucketName: string, objectId: string) {
  return new Promise((resolve, reject) => {
    // Assuming `minioClient` is already defined
    minioClient.presignedUrl(
      "GET",
      bucketName,
      objectId,
      (err, presignedUrl) => {
        if (err) {
          console.error(
            `Error getting presigned URL for object ${objectId} from bucket ${bucketName}:`,
            err
          );
          reject(err);
        } else {
          resolve(presignedUrl);
        }
      }
    );
  });
}

app.post(
  "/api/job-offers",
  upload.fields([{ name: "logo" }, { name: "image" }]),
  async (req: Request, res: Response) => {
    try {
      const { title, description, companyName } = req.body;

      if (!req.files) {
        return res.status(400).json({ error: "Missing files" });
      }

      const logoFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["logo"][0];
      const imageFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["image"][0];

      const logoMinioId = randomUUID();
      const imageMinioId = randomUUID();

      //get the format of the file , example : png , jpeg
      const logoFormat = path.extname(logoFile.originalname).substring(1);
      const imageFormat = path.extname(imageFile.originalname).substring(1);

      console.log("logoFormat", logoFormat);
      console.log("imageFormat", imageFormat);

      await minioClient.putObject(
        "meetmyjob",
        logoMinioId + "." + logoFormat,
        logoFile.buffer,
        logoFile.size
      );

      await minioClient.putObject(
        "meetmyjob",
        imageMinioId + "." + imageFormat,
        imageFile.buffer,
        imageFile.size
      );

      const newJobOffer = await prisma.jobOffer.create({
        data: {
          title,
          description,
          imageMinioId: imageMinioId + "." + imageFormat,
          logoMinioId: logoMinioId + "." + logoFormat,
          companyName,
        },
      });

      res.json(newJobOffer);
    } catch (error) {
      console.error("Error creating job offer:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the job offer" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
