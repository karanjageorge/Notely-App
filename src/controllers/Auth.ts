import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient(); ///instance of prisma client

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await client.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};
