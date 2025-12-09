import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // store file in memory as buffer
});
