import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient(); ///instance of prisma client

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, synopsis, content } = req.body;
    await client.entry.create({
      data: {
        title,
        synopsis,
        content,
        userId: req.user.id, //accessing the user id from the req object populated by the verifyToken middleware
      },
    });
    res.status(201).json({ message: "Note created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!!" });
  }
};
///2.GETTING ALL entries
export const getAllEntries = async (req: Request, res: Response) => {
  try {
    const entries = await client.entry.findMany({
      where: { isDeleted: false },
      select: {
        //using select to select which fields we want to use
        id: true, ///by adding true we are telling prisma to include the field in the results i.e the id field
        title: true,
        synopsis: true,
        content: true,
        dateCreated: true,
        user: {
          select: {
            ///this is a nested select
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

///3.GETTING A SINGLE entry BY ID
export const getEntryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const entry = await client.entry.findFirst({
      where: {
        AND: [{ id: String(id) }, { userId }, { isDeleted: false }],
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            username: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    //validating if entry exists
    if (!entry) {
      res.status(404).json({ message: "Note unavailable" });
      return;
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateEntry = async (req: Request, res: Response) => {
  try {
    // this is known as object destructuring(js feature that allows u to pull out properties from an object easily).This helps write cleaner and shorter codes especially where there are multiple parameters i.e if the route two parameters : const {userId, blogId} = req.params; would extract both at once instead of writing : const user = req.params.userId; const blogId = req.params.blogId;

    //one can also write it as const id = req.params.id; ---- both extract the value of id from the req.params object and store it in a variable called id
    const { id } = req.params;

    const { title, synopsis, content } = req.body;

    //updating allowed field
    await client.entry.update({
      where: { id: String(id) },
      data: {
        title,
        synopsis,
        content,
      },
    });
    res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

///MOVING entry TO TRASH
export const deleteEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    ///.client.entry.update does soft deletion unlike .client.blog.delete which does hard delete
    await client.entry.update({
      where: { id: String(id) },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).json({ message: "Note moved to trash successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

///RESTORE FROM BIN
export const restoreFromBin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await client.entry.update({
      where: { id: String(id) },
      data: {
        isDeleted: false,
      },
    });
    res.status(200).json({ message: "Note restored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

//PERMANENTLY DELETING AN ENTRY
export const eraseEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await client.entry.delete({
      where: { id: String(id) },
    });
    res.status(200).json({ message: "Note Permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};
