import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const userProf = await client.user.findUnique({
      where: { id: userId },
      select: {
        ///if there is no auto complete of the field sit means that the import path used is incorrect or the prisma client is not generated
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatar: true,
      },
    });
    //validation
    if (!userProf) {
      res.status(404).json({ message: "User Not found" });
      return;
    }

    res.status(200).json({ userProf });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; //from verifyToken middleware
    const { firstName, lastName, username, email } = req.body;
    const profUpdate = await client.user.update({
      where: { id: String(userId) },
      data: {
        firstName,
        lastName,
        username,
        email,
        avatar: req.body.avatar,
      },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatar: true,
      },
    });
    res
      .status(200)
      .json({ message: "Profile updated successfully", profUpdate });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getUserEntry = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const entries = await client.entry.findMany({
      where: {
        AND: [{ userId: userId }, { isDeleted: false }],
      },
      select: {
        id: true, ///return ID for the entry as the path in the frontend depends on it
        title: true,
        synopsis: true,
        content: true,
        dateCreated: true,
      },
    });

    if (!entries || entries.length === 0) {
      return res.status(404).json({ message: "No Notes found for this user" });
    }

    res.status(200).json({
      message: "User entries retrieved successfully",
      entries,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

///GET USERS TRASH
export const getUserTrash = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const deletedEntries = await client.entry.findMany({
      where: {
        AND: [{ userId: userId }, { isDeleted: true }],
      },
      select: {
        id: true,
        title: true,
        synopsis: true,
        content: true,
        dateCreated: true,
      },
    });

    res.status(200).json({ entries: deletedEntries });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
