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
    //generate a token using  jwt
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: "7d",
    });
    res.status(200).cookie("authToken", token).json(payload);
    res.status(200).json({ message: "Logged in successfully" });
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
    const { oldPassword, newPassword } = req.body;
    //fetch the user from the db using the id from the req object
    const user = await client.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //compare the old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    //hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    //update the password in the db
    await client.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword },
    });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!" });
  }
};
