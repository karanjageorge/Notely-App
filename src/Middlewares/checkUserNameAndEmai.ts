import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
export const checkUsernameAndEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email } = req.body;
    const userWithName = await client.user.findUnique({
      where: {
        username: username,
      },
    });
    if (userWithName) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    const userWithEmail = await client.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userWithEmail) {
      return res.status(400).json({
        message:
          "Email u have provided is already associated with another account",
      });
    }
    next();
  } catch (error) {}
};
