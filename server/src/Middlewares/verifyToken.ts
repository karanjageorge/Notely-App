import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized! Please log in." });
  }

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY!);

    //attach the decoded payload to the req object for further use
    req.user = decoded as User; ///typecasting to solve

    next(); //proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized! Please log in." });
  }
};
