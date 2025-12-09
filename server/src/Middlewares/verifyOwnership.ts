import { PrismaClient } from "@prisma/client";
import { type Request, type Response, type NextFunction } from "express";

const client = new PrismaClient();

export const validateEntryOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    // Basic guards
    if (!id) {
      return res.status(400).json({ message: "Missing Entry id" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const entry = await client.entry.findFirst({
      where: {
        id: String(id), // ensure string
        userId: String(userId), // ensure string
      },
    });

    if (!entry) {
      return res.status(404).json({ message: "Note unavailable " });
    }

    // Attach entry to request for downstream handlers if needed
    (req as any).entry = entry;

    return next();
  } catch (error) {
    console.error("validateEntryOwnership error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
