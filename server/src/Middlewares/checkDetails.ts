import { type Request, type Response, type NextFunction } from "express";
export const checkDetails = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { firstName, lastName, username, email, password } = req.body;
  if (!firstName) {
    return res.status(400).json({ message: "First name is required" });
  }
  if (!lastName) {
    return res.status(400).json({ message: "Last name is required" });
  }
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email address is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  next();
};
