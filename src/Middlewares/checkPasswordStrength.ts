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
    const feedback = result.feedback;

    res.status(400).json({
      message: "Stronger password required",
      suggestions: feedback.suggestions,
      warning: feedback.warning,
    });
    return;
  }
  next();
};
