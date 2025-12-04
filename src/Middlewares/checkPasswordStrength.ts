import { type Request, type Response, type NextFunction } from "express";
import zxcvbn from "zxcvbn";
export const checkPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password } = req.body;
  const result = zxcvbn(password);
  if (result.score < 3) {
    return res
      .status(400)
      .json({
        message: "Password is too weak. Please use a stronger password.",
      });
  }
  next();
};
