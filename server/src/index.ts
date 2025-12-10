import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import { login, logout, register, updatePassword } from "./controllers/Auth.ts";

import { checkDetails } from "./Middlewares/checkDetails.ts";
import { checkUsernameAndEmail } from "./Middlewares/checkUserNameAndEmai.ts";
import { checkPassword } from "./Middlewares/checkPasswordStrength.ts";
import { verifyToken } from "./Middlewares/verifyToken.ts";
import {
  createNote,
  deleteEntry,
  eraseEntry,
  getAllEntries,
  getEntryById,
  restoreFromBin,
  updateEntry,
} from "./controllers/Notes.ts";
import { validateNoteDetails } from "./Middlewares/validateNoteDetails.ts";
import { validateEntryOwnership } from "./Middlewares/verifyOwnership.ts";
import {
  getUserEntry,
  getUserProfile,
  getUserTrash,
  updateUserProfile,
} from "./controllers/Users.ts";

dotenv.config(); //this will load the .env file and make the variables available in process.env
const app = express();

const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json()); // Middleware to parse JSON bodies such as the req.body
app.use(cookieParser()); // Middleware to parse cookies from incoming requests
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with requests
  }),
);

app.get("/", (_req, res) => {
  res.status(200).send("Hello, Notely!");
});

//Auth routes
app.post(
  `/auth/register`,
  checkDetails,
  checkUsernameAndEmail,
  checkPassword,
  register,
);
app.post("/auth/login", login);
app.post("/auth/logout", logout);

//Notes routes
app.post("/entries", verifyToken, validateNoteDetails, createNote);
app.get("/entries/all", verifyToken, getAllEntries);
app.get("/entries/:id", verifyToken, getEntryById);
app.patch("/entries/:id", verifyToken, validateEntryOwnership, updateEntry);
app.patch(
  "/entries/trash/:id",
  verifyToken,
  validateEntryOwnership,
  deleteEntry,
);
app.patch(
  "/entries/restore/:id",
  verifyToken,
  validateEntryOwnership,
  restoreFromBin,
);
app.delete("/entries/:id", verifyToken, validateEntryOwnership, eraseEntry);

//user routes
app.get("/profile", verifyToken, getUserProfile);
app.patch(
  "/profile/update",
  verifyToken,
  checkUsernameAndEmail,
  upload.single("file"),
  updateUserProfile,
);
app.get("/profile/entries", verifyToken, getUserEntry);
app.get("/profile/trash", verifyToken, getUserTrash);
app.patch("/profile/password", verifyToken, updatePassword);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
