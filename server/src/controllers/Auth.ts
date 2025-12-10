import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
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
    res.status(500).json({ message: "Something went wrong!!" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    const user = await client.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
        isDeleted: false, //prevent login for deleted users
      },
    });

    //check if user exists
    if (!user) {
      return res.status(400).json({ message: "Wrong login credentials" });
    }

    //comparing the input password to the stored hashed password in the db
    const passwordMatch = bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Wrong login credentials" });
    }

    //create a payload to be sent to the jwt sign method and hide the password
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    };

    //generate a token using jwt
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .cookie("authToken", token)
      .json({ message: "Logged in successfully", payload });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!" });
  }
};

export const logout = (req: Request, res: Response) => {
  //excemption handling
  try {
    res
      .status(200)
      .clearCookie("authToken")
      .json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "All password fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Fetch user from DB
    const user = await client.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await client.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("updatePassword error:", error);
    return res.status(500).json({ message: "Something went wrong!!" });
  }
};
